import { memberRegistrationProviders } from '../member-registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberRegistrationQueries } from '../member-registration.queries';
import {
    MemberRegistrationAggregateModel,
    MemberRegistrationAggregateRepo,
} from '../infrastructure/member-registration-aggregate.repo';
import { ICommandBus, MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { LocalEventBusModule } from '../../local-event-bus/local-event-bus.module';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { COMMAND_BUS, CommandBusModule } from '../../command-bus/command-bus.module';
import { CreateMemberCommand } from '../commands/create-member.command';
import { DeleteMemberCommand } from '../commands/delete-member.command';
import { MemberRegistrationQueryModel } from '../infrastructure/member-registration-query.repo';

describe('Member Registration Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commandBus: ICommandBus;
    let queries: MemberRegistrationQueries;
    let aggregateRepo: MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>;

    beforeAll(async () => {
        mongodb = await MongoMemoryReplSet.create({
            replSet: {
                count: 1,
                dbName: 'test',
                storageEngine: 'wiredTiger',
            },
        });

        module = await Test.createTestingModule({
            providers: memberRegistrationProviders,
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') }), LocalEventBusModule, CommandBusModule],
        }).compile();

        commandBus = module.get(COMMAND_BUS);
        aggregateRepo = module.get(MemberRegistrationAggregateRepo);
        await aggregateRepo.init();
        queries = module.get<MemberRegistrationQueries>(MemberRegistrationQueries);
    });

    afterEach(async () => {
        jest.resetAllMocks();
        await (module.get(getMongoToken()) as MongoClient).db().dropDatabase();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('Given a Member Registration', () => {
        let memberId: string;
        beforeEach(async () => {
            const _ = await commandBus.sendSync(new CreateMemberCommand({ name: 'John Doe' }));
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
                    expect(await queries.getMemberQuery(memberId)).toBe(null);
                });
            });
        });

        describe('When getting a member from query model', () => {
            let member: MemberRegistrationQueryModel | null;

            beforeEach(async () => {
                member = await queries.getMemberQuery(memberId);
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
