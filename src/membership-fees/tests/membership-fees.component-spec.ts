import { membershipFeesAggregateRepo } from '../membership-fees.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoAggregateRepo } from '../../common';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import mongoose, { Connection } from 'mongoose';
import { MembershipFeesSerializer } from '../infrastructure/membership-fees.serializer';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { MembershipFeesCommands } from '../membership-fees.commands';
import { FeeId } from '../domain/ids/fee-id';
import { MembershipFeesAggregateModel } from '../infrastructure/membership-fees-aggregate.model';
import { MemberId } from '../../member-registration/domain/ids/member-id';

const getActiveConnection = (): mongoose.Connection => {
    return mongoose.connections.find((_) => _.readyState)!;
};
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
                    provide: membershipFeesAggregateRepo,
                    inject: [getConnectionToken()],
                    useFactory: (conn: Connection) => {
                        return new MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>(
                            new MembershipFeesSerializer(),
                            conn.getClient(),
                            'membership_fees_aggregate',
                        );
                    },
                },
            ],
            imports: [MongooseModule.forRoot(mongodb.getUri('test'))],
        }).compile();

        commands = module.get<MembershipFeesCommands>(MembershipFeesCommands);
        aggregateRepo =
            module.get<MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>>(
                membershipFeesAggregateRepo,
            );
        await aggregateRepo.onModuleInit();
    });

    afterEach(async () => {
        jest.resetAllMocks();
        await getActiveConnection().collection('membership_fees_aggregate').deleteMany({});
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('Given a Membership Fees', () => {
        const memberId = MemberId.generate();

        describe('When adding a fee', () => {
            let feeId: FeeId;

            beforeEach(async () => {
                feeId = await commands.addFeeCmd(memberId, 100);
            });

            it('should return an id', () => {
                expect(memberId.toString()).toContain('member');
            });

            it('should be saved into aggregate model', async () => {
                expect(await aggregateRepo.getById(memberId)).not.toBeNull();
            });

            it('should return a fee id', async () => {
                expect(feeId.type).toBe('fee');
            });

            it('should add a fee', async () => {
                expect(await aggregateRepo.getById(memberId)).toMatchObject({
                    fees: [{ feeId: expect.anything(), value: 100 }],
                });
            });
        });
    });
});
