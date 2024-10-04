import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFeesAggregateRepo } from '../@infra/member-fees.aggregate-repo';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { AccountingProviders } from '../accounting.module';
import { EventBus, EventBusModule } from '../../@infra/event-bus/event-bus.module';
import { MembersService } from '../../registration/members.service';
import { AccountingCommandBus } from '../@infra/accounting.command-bus';
import { AccountingQueryBus } from '../@infra/accounting.query-bus';
import { MemberRegistered } from '../../registration/events/member-registered.event';
import { GetCreditAmountsQuery } from '../queries/get-credit-amounts.query-handler';
import { MemberRenamed } from '../../registration/events/member-renamed.event';
import { MemberDeleted } from '../../registration/events/member-deleted.event';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { PayFeeCommand } from '../commands/pay-fee.command-handler';

describe('Credit Amount Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let accountingCommandBus: AccountingCommandBus;
    let eventBus: EventBus;
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

        eventBus = module.get(EventBus);
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

    describe('On MemberRegistered event ', () => {
        it('get credit amounts query should should return member credit amount', async () => {
            await eventBus.publishAndWaitForHandlers(new MemberRegistered({ memberId, memberName: 'Nina Jolt' }));

            expect(await accountingQueryBus.execute(new GetCreditAmountsQuery({}))).toEqual([
                {
                    creditAmount: 0,
                    deleted: false,
                    memberId: 'foo-member-id',
                    memberName: 'Nina Jolt',
                },
            ]);
        });
    });

    describe('Add fee', () => {
        beforeEach(async () => {
            await eventBus.publishAndWaitForHandlers(new MemberRegistered({ memberId, memberName: 'Nina Jolt' }));
        });

        it('get credit amounts query should return increased credit amount', async () => {
            await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));

            expect(await accountingQueryBus.execute(new GetCreditAmountsQuery({}))).toEqual([
                expect.objectContaining({
                    creditAmount: 100,
                }),
            ]);
        });
    });

    describe('Pay fee', () => {
        let feeId: string;
        beforeEach(async () => {
            await eventBus.publishAndWaitForHandlers(new MemberRegistered({ memberId, memberName: 'Nina Jolt' }));
            const _ = await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
            feeId = _.feeId;
        });

        it('get credit amounts query should return decreased credit amount', async () => {
            await accountingCommandBus.sendSync(new PayFeeCommand({ memberId, feeId }));

            expect(await accountingQueryBus.execute(new GetCreditAmountsQuery({}))).toEqual([
                expect.objectContaining({
                    creditAmount: 0,
                }),
            ]);
        });
    });

    describe('On MemberRenamed event', () => {
        beforeEach(async () => {
            await eventBus.publishAndWaitForHandlers(new MemberRegistered({ memberId, memberName: 'Nina Jolt' }));
        });

        it('get credit amounts query should return the updated member name', async () => {
            await eventBus.publishAndWaitForHandlers(new MemberRenamed({ memberId, memberName: 'Luna Jett' }));

            expect(await accountingQueryBus.execute(new GetCreditAmountsQuery({}))).toEqual([
                {
                    creditAmount: 0,
                    deleted: false,
                    memberId: 'foo-member-id',
                    memberName: 'Luna Jett',
                },
            ]);
        });
    });

    describe('On MemberDeleted event', () => {
        beforeEach(async () => {
            await eventBus.publishAndWaitForHandlers(new MemberRegistered({ memberId, memberName: 'Nina Jolt' }));
        });

        it('get credit amounts query should return nothing', async () => {
            await eventBus.publishAndWaitForHandlers(new MemberDeleted({ memberId }));

            expect(await accountingQueryBus.execute(new GetCreditAmountsQuery({}))).toEqual([]);
        });
    });
});
