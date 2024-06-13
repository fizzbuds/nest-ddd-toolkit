import { RegistrationProviders } from '../registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberAggregateRepo } from '../infrastructure/member.aggregate-repo';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { EventBus, EventBusModule } from '../../event-bus/event-bus.module';
import { MembersService } from '../members.service';
import { MemberDeleted } from '../events/member-deleted.event';
import { MemberRegistered } from '../events/member-registered.event';

describe('Member Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let membersService: MembersService;
    let eventBus: EventBus;

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
        eventBus = module.get(EventBus);
        await module.get(MemberAggregateRepo).init();

        jest.spyOn(eventBus, 'publishAndWaitForHandlers');
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

        it('should publish member registered event', async () => {
            const { memberId } = await membersService.registerMember('John Doe');

            expect(eventBus.publishAndWaitForHandlers).toHaveBeenCalledWith({
                name: MemberRegistered.name,
                payload: { memberId, memberName: 'John Doe' },
            });
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

        it('should publish member deleted event', async () => {
            const { memberId } = await membersService.registerMember('John Doe');

            await membersService.deleteMember(memberId);

            expect(eventBus.publishAndWaitForHandlers).toHaveBeenCalledWith({
                name: MemberDeleted.name,
                payload: { memberId },
            });
        });
    });
});
