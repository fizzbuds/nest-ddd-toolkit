import { memberRegistrationAggregateRepo } from '../member-registration.module';
import 'jest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoAggregateRepo } from '../../common';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { Connection } from 'mongoose';
import { MemberRegistrationSerializer } from '../infrastructure/member-registration.serializer';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { MemberRegistrationCommands } from '../member-registration.commands';
import { MemberId } from '../domain/ids/member-id';
import { MemberRegistrationAggregateModel } from '../infrastructure/member-registration-aggregate.model';
import {
    MemberRegistrationQueryModel,
    MemberRegistrationQueryRepo,
} from '../infrastructure/member-registration-query.repo';
import { MemberRegistrationRepoHooks } from '../infrastructure/member-registration.repo-hooks';

describe('Member Registration Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commands: MemberRegistrationCommands;
    let aggregateRepo: MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>;
    let queryRepo: MemberRegistrationQueryRepo;

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
                MemberRegistrationCommands,
                MemberRegistrationQueryRepo,
                MemberRegistrationRepoHooks,
                {
                    provide: memberRegistrationAggregateRepo,
                    inject: [getConnectionToken(), MemberRegistrationRepoHooks],
                    useFactory: (conn: Connection, memberRegistrationRepoHooks: MemberRegistrationRepoHooks) => {
                        return new MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>(
                            new MemberRegistrationSerializer(),
                            conn.getClient(),
                            'membership_fees_aggregate',
                            memberRegistrationRepoHooks,
                        );
                    },
                },
                {
                    provide: MemberRegistrationQueryRepo,
                    inject: [getConnectionToken()],
                    useFactory: (conn: Connection) => {
                        return new MemberRegistrationQueryRepo(conn.getClient(), 'member_query_repo');
                    },
                },
            ],
            imports: [MongooseModule.forRoot(mongodb.getUri('test'))],
        }).compile();

        commands = module.get<MemberRegistrationCommands>(MemberRegistrationCommands);
        aggregateRepo = module.get<MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>>(
            memberRegistrationAggregateRepo,
        );
        await aggregateRepo.onModuleInit();
        queryRepo = module.get<MemberRegistrationQueryRepo>(MemberRegistrationQueryRepo);
        await queryRepo.onModuleInit();
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
            memberId = await commands.createCmd();
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
                member = await queryRepo.getMember(memberId);
            });

            it('should return a member', () => {
                expect(member).not.toBeNull();
            });
        });
    });
});
