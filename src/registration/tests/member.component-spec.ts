import { RegistrationProviders } from '../registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberAggregate } from '../domain/member.aggregate';
import { MemberAggregateModel, MemberAggregateRepo } from '../infrastructure/member.aggregate-repo';
import { ICommandBus, IQueryBus, MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { CommandBus, CommandBusModule } from '../../command-bus/command-bus.module';
import { MemberQueryModel } from '../infrastructure/member.query-repo';
import { EventBusModule } from '../../event-bus/event-bus.module';
import { RegisterMemberCommand } from '../commands/register-member.command-handler';
import { DeleteMemberCommand } from '../commands/delete-member.command-handler';
import { GetMemberQuery } from '../queries/get-member.query-handler';
import { MemberQueryBus } from '../infrastructure/member.query-bus';

describe('Member Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commandBus: ICommandBus;
    let queryBus: IQueryBus;
    let aggregateRepo: MongoAggregateRepo<MemberAggregate, MemberAggregateModel>;

    beforeAll(async () => {
        mongodb = await MongoMemoryReplSet.create({
            replSet: {
                count: 1,
                dbName: 'test',
                storageEngine: 'wiredTiger',
            },
        });

        module = await Test.createTestingModule({
            providers: RegistrationProviders,
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') }), EventBusModule, CommandBusModule],
        }).compile();

        commandBus = module.get(CommandBus);
        aggregateRepo = module.get(MemberAggregateRepo);
        await aggregateRepo.init();
        queryBus = module.get(MemberQueryBus);
    });

    afterEach(async () => {
        jest.resetAllMocks();
        await (module.get(getMongoToken()) as MongoClient).db().dropDatabase();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('Register member', () => {
        let memberId: string;
        beforeEach(async () => {
            const _ = await commandBus.sendSync(new RegisterMemberCommand({ name: 'John Doe' }));
            memberId = _.memberId;
        });

        it('should register the member', async () => {
            const member = await aggregateRepo.getById(memberId);
            expect(member).toMatchObject({ name: 'John Doe' });
        });
    });

    describe('Given a registered member', () => {
        let memberId: string;
        beforeEach(async () => {
            const _ = await commandBus.sendSync(new RegisterMemberCommand({ name: 'John Doe' }));
            memberId = _.memberId;
        });

        it('should be saved into aggregate model', async () => {
            expect(await aggregateRepo.getById(memberId)).not.toBeNull();
        });

        describe('When deleting it', () => {
            beforeEach(async () => {
                await commandBus.sendSync(new DeleteMemberCommand({ memberId }));
            });

            it('should be soft deleted into aggregate model', async () => {
                expect(await aggregateRepo.getById(memberId)).toMatchObject({ deleted: true });
            });

            describe('And getting it from query model', () => {
                it('should return null', async () => {
                    expect(await queryBus.execute(new GetMemberQuery({ memberId }))).toBe(null);
                });
            });
        });

        describe('When getting a member from query model', () => {
            let member: MemberQueryModel | null;

            beforeEach(async () => {
                member = await queryBus.execute(new GetMemberQuery({ memberId }));
            });

            it('should return a member', () => {
                expect(member).not.toBeNull();
            });

            it('should return a member with a name', () => {
                expect(member).toMatchObject({
                    name: 'John Doe',
                });
            });
        });
    });
});
