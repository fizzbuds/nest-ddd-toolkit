import { RegistrationProviders } from '../registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberAggregate } from '../domain/member.aggregate';
import { MemberAggregateModel, MemberAggregateRepo } from '../infrastructure/member.aggregate-repo';
import { IQueryBus, MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { CommandBusModule } from '../../command-bus/command-bus.module';
import { EventBusModule } from '../../event-bus/event-bus.module';
import { GetMemberQuery } from '../queries/get-member.query-handler';
import { MemberQueryBus } from '../infrastructure/member.query-bus';
import { MembersService } from '../members.service';

describe('Member Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let membersService: MembersService;
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

        membersService = module.get(MembersService);
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
        it('should register the member', async () => {
            const { memberId } = await membersService.registerMember('John Doe');

            const member = await aggregateRepo.getById(memberId);
            expect(member).toMatchObject({ name: 'John Doe' });
        });
    });

    describe(`Delete member`, () => {
        let memberId: string;
        beforeEach(async () => {
            const _ = await membersService.registerMember('John Doe');
            memberId = _.memberId;
        });

        it('should be soft deleted into aggregate model', async () => {
            await membersService.deleteMember(memberId);

            expect(await aggregateRepo.getById(memberId)).toMatchObject({ deleted: true });
        });

        it('should be deleted into read model', async () => {
            await membersService.deleteMember(memberId);

            expect(await queryBus.execute(new GetMemberQuery({ memberId }))).toBe(null);
        });
    });
});
