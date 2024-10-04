import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFeesAggregateRepo } from '../@infra/member-fees.aggregate-repo';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { AccountingProviders } from '../accounting.module';
import { EventBusModule } from '../../@infra/event-bus/event-bus.module';
import { MembersService } from '../../registration/members.service';
import { AccountingCommandBus } from '../@infra/accounting.command-bus';
import { AccountingQueryBus } from '../@infra/accounting.query-bus';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { PayFeeCommand } from '../commands/pay-fee.command-handler';
import { GetFeesQuery } from '../queries/get-fees.query-handler';
import { DeleteFeeCommand } from '../commands/delete-fee.command-handler';

describe('Fee Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let accountingCommandBus: AccountingCommandBus;
    let accountingQueryBus: AccountingQueryBus;

    beforeAll(async () => {
        mongodb = await MongoMemoryReplSet.create({
            replSet: {
                count: 1,
                dbName: 'test',
                storageEngine: 'wiredTiger',
            },
        });

        module = await Test.createTestingModule({
            providers: [
                ...AccountingProviders,
                {
                    provide: MembersService,
                    useValue: { getMember: jest.fn() },
                },
            ],
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') }), EventBusModule],
        }).compile();

        await module.get(MemberFeesAggregateRepo).init();

        accountingCommandBus = module.get(AccountingCommandBus);
        accountingQueryBus = module.get(AccountingQueryBus);
    });

    afterEach(async () => {
        jest.resetAllMocks();
        await (module.get(getMongoToken()) as MongoClient).db().dropDatabase();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    const memberId = 'foo-member-id';

    describe('Add fee', () => {
        it('get fees query should return added fee', async () => {
            await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));

            expect(await accountingQueryBus.execute(new GetFeesQuery({}))).toEqual([
                expect.objectContaining({
                    deleted: false,
                    memberId: 'foo-member-id',
                    paid: false,
                    value: 100,
                }),
            ]);
        });
    });

    describe('Pay fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
            feeId = _.feeId;
        });

        it('get fees query should return paid fee', async () => {
            await accountingCommandBus.sendSync(new PayFeeCommand({ memberId, feeId }));

            expect(await accountingQueryBus.execute(new GetFeesQuery({}))).toEqual([
                expect.objectContaining({
                    deleted: false,
                    memberId: 'foo-member-id',
                    paid: true,
                    value: 100,
                }),
            ]);
        });
    });

    describe('Delete fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
            feeId = _.feeId;
        });

        it('get fees query should return nothing', async () => {
            await accountingCommandBus.sendSync(new DeleteFeeCommand({ memberId, feeId }));

            expect(await accountingQueryBus.execute(new GetFeesQuery({}))).toEqual([]);
        });
    });
});
