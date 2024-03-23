import { memberRegistrationProviders } from '../member-registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberRegistrationCommands } from '../member-registration.commands';
import { MemberId } from '../domain/ids/member-id';
import { MemberRegistrationQueryModel } from '../infrastructure/member-registration-query.repo';
import { MemberRegistrationQueries } from '../member-registration.queries';
import {
    MemberRegistrationAggregateModel,
    MemberRegistrationAggregateRepo,
} from '../infrastructure/member-registration-aggregate.repo';
import mongoose from 'mongoose';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { LocalEventBusModule } from '../../local-event-bus/local-event-bus.module';

const getActiveConnection = (): mongoose.Connection => {
    return mongoose.connections.find((_) => _.readyState)!; // TODO maybe there is a better way using mongodb
};
describe('Member Registration Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commands: MemberRegistrationCommands;
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
            imports: [MongooseModule.forRoot(mongodb.getUri('test')), LocalEventBusModule],
        }).compile();

        commands = module.get<MemberRegistrationCommands>(MemberRegistrationCommands);
        aggregateRepo = module.get<MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>>(
            MemberRegistrationAggregateRepo,
        );
        await aggregateRepo.init();
        queries = module.get<MemberRegistrationQueries>(MemberRegistrationQueries);
    });

    afterEach(async () => {
        jest.resetAllMocks();
        await getActiveConnection().collection('member_registration_aggregate').deleteMany({});
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('Given a Member Registration', () => {
        let memberId: MemberId;
        beforeEach(async () => {
            memberId = await commands.createCmd('John Doe');
        });

        it('should return an id', () => {
            expect(memberId.toString()).toContain('member');
        });

        it('should be saved into aggregate model', async () => {
            expect(await aggregateRepo.getById(memberId.toString())).not.toBeNull();
        });

        describe('When deleting it', () => {
            beforeEach(async () => {
                await commands.deleteCmd(memberId);
            });

            it('should be soft deleted into aggregate model', async () => {
                expect(await aggregateRepo.getById(memberId.toString())).toMatchObject({ deleted: true });
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
