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

describe('Member Registration Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let commands: MemberRegistrationCommands;
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
            providers: [
                MemberRegistrationCommands,
                {
                    provide: memberRegistrationAggregateRepo,
                    inject: [getConnectionToken()],
                    useFactory: (conn: Connection) => {
                        return new MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>(
                            new MemberRegistrationSerializer(),
                            conn.getClient(),
                            'membership_fees_aggregate',
                        );
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
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    describe('When creating a Member Registration', () => {
        let memberRegistration: MemberId;
        beforeEach(async () => {
            memberRegistration = await commands.createCmd();
        });

        it('should return an id', () => {
            expect(memberRegistration.toString()).toContain('member');
        });

        it('should be saved into aggregate model', async () => {
            expect(await aggregateRepo.getById(memberRegistration)).not.toBeNull();
        });
    });
});
