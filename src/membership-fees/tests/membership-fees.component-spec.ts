import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MembershipFeesSerializer } from '../infrastructure/membership-fees.serializer';
import { MembershipFeesCommands } from '../membership-fees.commands';
import {
    MembershipFeesAggregateModel,
    MembershipFeesAggregateRepo,
} from '../infrastructure/membership-fees-aggregate.repo';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';

describe('Membership Fees Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commands: MembershipFeesCommands;
    let aggregateRepo: MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>;

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
                MembershipFeesCommands,
                {
                    provide: MembershipFeesAggregateRepo,
                    inject: [getMongoToken()],
                    useFactory: (mongoClient: MongoClient) => {
                        return new MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>(
                            new MembershipFeesSerializer(),
                            mongoClient,
                            'membership_fees_aggregate',
                        );
                    },
                },
            ],
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') })],
        }).compile();

        commands = module.get<MembershipFeesCommands>(MembershipFeesCommands);
        aggregateRepo =
            module.get<MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>>(
                MembershipFeesAggregateRepo,
            );
        await aggregateRepo.init();
    });

    afterEach(async () => {
        jest.resetAllMocks();
        await (module.get(getMongoToken()) as MongoClient).db().dropDatabase();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('Given a Membership Fees', () => {
        const memberId = 'foo-member-id';

        describe('When adding a fee', () => {
            let feeId: string;

            beforeEach(async () => {
                feeId = await commands.addFeeCmd(memberId, 100);
            });

            it('should be saved into aggregate model', async () => {
                expect(await aggregateRepo.getById(memberId.toString())).not.toBeNull();
            });

            it('should add a fee', async () => {
                expect(await aggregateRepo.getById(memberId.toString())).toMatchObject({
                    fees: [{ feeId: feeId, value: 100, deleted: false }],
                });
            });

            it('should increase the credit amount', async () => {
                expect((await aggregateRepo.getById(memberId.toString()))?.getCreditAmount()).toEqual(100);
            });
        });

        describe('Given a fee', () => {
            let feeId: string;

            beforeEach(async () => {
                feeId = await commands.addFeeCmd(memberId, 100);
            });

            describe('When deleting it', () => {
                beforeEach(async () => {
                    await commands.deleteFeeCmd(memberId, feeId);
                });

                it('should mark it as deleted', async () => {
                    expect(await aggregateRepo.getById(memberId.toString())).toMatchObject({
                        fees: [{ feeId: feeId, value: 100, deleted: true }],
                    });
                });

                it('should decrease the credit amount', async () => {
                    expect((await aggregateRepo.getById(memberId.toString()))?.getCreditAmount()).toEqual(0);
                });
            });
        });
    });
});
