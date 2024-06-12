import { RegistrationProviders } from '../registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberAggregateRepo } from '../infrastructure/member.aggregate-repo';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { EventBusModule } from '../../event-bus/event-bus.module';
import { MembersService } from '../members.service';

describe('Member Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let membersService: MembersService;

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
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') }), EventBusModule],
        }).compile();

        membersService = module.get(MembersService);
        await module.get(MemberAggregateRepo).init();
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

            expect(await membersService.getMember(memberId)).toMatchObject({ name: 'John Doe' });
        });
    });

    describe('Rename member', () => {
        it('should rename the member', async () => {
            const { memberId } = await membersService.registerMember('John Doe');

            await membersService.renameMember(memberId, 'Jane Doe');

            expect(await membersService.getMember(memberId)).toMatchObject({ name: 'Jane Doe' });
        });
    });

    describe(`Delete member`, () => {
        it('should delete the member', async () => {
            const { memberId } = await membersService.registerMember('John Doe');

            await membersService.deleteMember(memberId);

            expect(await membersService.getMember(memberId)).toBeNull();
        });
    });
});
