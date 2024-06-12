import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFeesAggregate } from '../domain/member-fees.aggregate';
import { MemberFeesAggregateModel, MemberFeesAggregateRepo } from '../infrastructure/member-fees.aggregate-repo';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { AccountingProviders } from '../accounting.module';
import { EventBusModule } from '../../event-bus/event-bus.module';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { DeleteFeeCommand } from '../commands/delete-fee.command-handler';
import { MembersService } from '../../registration/members.service';
import { DeleteAllFeeCommand } from '../commands/delete-all-fee.command-handler';
import { PayFeeCommand } from '../commands/pay-fee.command-handler';
import { AccountingCommandBus } from '../infrastructure/accounting.command-bus';

describe('Member Fees Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let accountingCommandBus: AccountingCommandBus;
    let aggregateRepo: MongoAggregateRepo<MemberFeesAggregate, MemberFeesAggregateModel>;

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
        aggregateRepo = module.get(MemberFeesAggregateRepo);
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

    describe('Add Fee', () => {
        it('should add a fee', async () => {
            const { feeId } = await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));

            expect(await aggregateRepo.getById(memberId)).toMatchObject({
                feesEntity: { fees: [{ feeId, value: 100, deleted: false }] },
            });
        });
    });

    describe('Delete Fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
            feeId = _.feeId;
        });

        it('should delete fee', async () => {
            await accountingCommandBus.sendSync(new DeleteFeeCommand({ memberId, feeId }));

            expect(await aggregateRepo.getById(memberId)).toMatchObject({
                feesEntity: { fees: [{ feeId, value: 100, deleted: true }] },
            });
        });
    });

    describe('Pay Fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
            feeId = _.feeId;
        });

        it('should pay fee', async () => {
            await accountingCommandBus.sendSync(new PayFeeCommand({ memberId, feeId }));

            expect(await aggregateRepo.getById(memberId)).toMatchObject({
                feesEntity: { fees: [{ feeId, value: 100, deleted: false, paid: true }] },
            });
        });
    });

    describe('Delete All Fee', () => {
        beforeEach(async () => {
            await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
            await accountingCommandBus.sendSync(new AddFeeCommand({ memberId, amount: 200 }));
        });

        it('should delete all fees', async () => {
            await accountingCommandBus.sendSync(new DeleteAllFeeCommand({ memberId }));

            expect(await aggregateRepo.getById(memberId)).toMatchObject({
                feesEntity: {
                    fees: [
                        expect.objectContaining({ value: 100, deleted: true }),
                        expect.objectContaining({
                            value: 200,
                            deleted: true,
                        }),
                    ],
                },
            });
        });
    });
});
