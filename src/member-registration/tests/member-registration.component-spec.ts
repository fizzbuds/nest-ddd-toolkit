import { memberRegistrationAggregateRepo, memberRegistrationProviders } from '../member-registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoAggregateRepo } from '../../common';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberRegistrationCommands } from '../member-registration.commands';
import { MemberId } from '../domain/ids/member-id';
import { MemberRegistrationAggregateModel } from '../infrastructure/member-registration-aggregate.model';
import { MemberRegistrationQueryModel } from '../infrastructure/member-registration-query.repo';
import { MemberRegistrationQueries } from '../member-registration.queries';

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
            imports: [MongooseModule.forRoot(mongodb.getUri('test'))],
        }).compile();

        commands = module.get<MemberRegistrationCommands>(MemberRegistrationCommands);
        aggregateRepo = module.get<MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>>(
            memberRegistrationAggregateRepo,
        );
        await aggregateRepo.onModuleInit();
        queries = module.get<MemberRegistrationQueries>(MemberRegistrationQueries);
    });

    afterEach(async () => {
        jest.resetAllMocks();
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
            expect(await aggregateRepo.getById(memberId)).not.toBeNull();
        });

        describe('When getting on member from query model', () => {
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
