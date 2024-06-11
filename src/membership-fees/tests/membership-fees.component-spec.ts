import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import {
    MembershipFeesAggregateModel,
    MembershipFeesAggregateRepo,
} from '../infrastructure/membership-fees-aggregate.repo';
import { ICommandBus, MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { CommandBus, CommandBusModule } from '../../command-bus/command-bus.module';
import { MembershipFeesProviders } from '../membership-fees.module';
import { EventBusModule } from '../../event-bus/event-bus.module';
import { MemberQueryBus } from '../../registration/infrastructure/member.query-bus';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { DeleteFeeCommand } from '../commands/delete-fee.command-handler';

describe('Membership Fees Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commandBus: ICommandBus;
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
                ...MembershipFeesProviders,
                {
                    provide: MemberQueryBus,
                    useValue: { execute: jest.fn() },
                },
            ],
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') }), CommandBusModule, EventBusModule],
        }).compile();

        commandBus = module.get(CommandBus);
        aggregateRepo = module.get(MembershipFeesAggregateRepo);
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
                const _ = await commandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
                feeId = _.feeId;
            });

            it('should be saved into aggregate model', async () => {
                expect(await aggregateRepo.getById(memberId)).not.toBeNull();
            });

            it('should add a fee', async () => {
                expect(await aggregateRepo.getById(memberId)).toMatchObject({
                    fees: [{ feeId: feeId, value: 100, deleted: false }],
                });
            });

            it('should increase the credit amount', async () => {
                expect((await aggregateRepo.getById(memberId))?.getCreditAmount()).toEqual(100);
            });
        });

        describe('Given a fee', () => {
            let feeId: string;

            beforeEach(async () => {
                const _ = await commandBus.sendSync(new AddFeeCommand({ memberId, amount: 100 }));
                feeId = _.feeId;
            });

            describe('When deleting it', () => {
                beforeEach(async () => {
                    await commandBus.sendSync(new DeleteFeeCommand({ memberId, feeId }));
                });

                it('should mark it as deleted', async () => {
                    expect(await aggregateRepo.getById(memberId)).toMatchObject({
                        fees: [{ feeId: feeId, value: 100, deleted: true }],
                    });
                });

                it('should decrease the credit amount', async () => {
                    expect((await aggregateRepo.getById(memberId))?.getCreditAmount()).toEqual(0);
                });
            });
        });
    });
});
