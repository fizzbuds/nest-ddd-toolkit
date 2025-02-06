import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFeesAggregate } from '../domain/member-fees.aggregate';
import { MemberFeesAggregateModel, MemberFeesAggregateRepo } from '../@infra/member-fees.aggregate-repo';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { AccountingProviders } from '../accounting.module';
import { EventBusModule } from '../../@infra/event-bus/event-bus.module';
import { MembersService } from '../../registration/members.service';
import { AccountingService } from '../accounting.service';

describe('Member Fees Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let service: AccountingService;
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

        service = module.get(AccountingService);
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
            const { feeId } = await service.addFee({ memberId, amount: 100 });

            expect(await aggregateRepo.getById(memberId)).toMatchObject({
                feesEntity: { fees: [{ feeId, value: 100, deleted: false }] },
            });
        });
    });

    describe('Delete Fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await service.addFee({ memberId, amount: 100 });
            feeId = _.feeId;
        });

        it('should delete fee', async () => {
            await service.deleteFee({ memberId, feeId });

            expect(await aggregateRepo.getById(memberId)).toMatchObject({
                feesEntity: { fees: [{ feeId, value: 100, deleted: true }] },
            });
        });
    });

    describe('Pay Fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await service.addFee({ memberId, amount: 100 });
            feeId = _.feeId;
        });

        it('should pay fee', async () => {
            await service.payFee({ memberId, feeId });

            expect(await aggregateRepo.getById(memberId)).toMatchObject({
                feesEntity: { fees: [{ feeId, value: 100, deleted: false, paid: true }] },
            });
        });
    });

    describe('Delete All Fee', () => {
        beforeEach(async () => {
            await service.addFee({ memberId, amount: 100 });
            await service.addFee({ memberId, amount: 200 });
        });

        it('should delete all fees', async () => {
            await service.deleteAllFees({ memberId });

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
