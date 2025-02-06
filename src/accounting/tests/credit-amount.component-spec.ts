import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFeesAggregateRepo } from '../@infra/member-fees.aggregate-repo';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { AccountingProviders } from '../accounting.module';
import { MembersService } from '../../registration/members.service';
import { AccountingService } from '../accounting.service';
import { AccountingHooks } from '../accounting.hooks';

describe('Credit Amount Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let service: AccountingService;
    let hooks: AccountingHooks;

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
                ...AccountingProviders,
                {
                    provide: MembersService,
                    useValue: { getMember: jest.fn() },
                },
            ],
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') })],
        }).compile();

        await module.get(MemberFeesAggregateRepo).init();

        service = module.get(AccountingService);
        hooks = module.get(AccountingHooks);
    });

    afterEach(async () => {
        jest.resetAllMocks();
        await (module.get(getMongoToken()) as MongoClient).db().dropDatabase();
    });

    afterAll(async () => {
        await module.close();
        await mongodb.stop();
    });

    const memberId = 'foo-member-id';

    describe('On MemberRegistered event ', () => {
        it('get credit amounts query should should return member credit amount', async () => {
            await hooks.onMemberRegistered({ memberId, memberName: 'Nina Jolt' });

            expect(await service.getCreditAmounts()).toEqual([
                {
                    creditAmount: 0,
                    deleted: false,
                    memberId: 'foo-member-id',
                    memberName: 'Nina Jolt',
                },
            ]);
        });
    });

    describe('Add fee', () => {
        beforeEach(async () => {
            await hooks.onMemberRegistered({ memberId, memberName: 'Nina Jolt' });
        });

        it('get credit amounts query should return increased credit amount', async () => {
            await service.addFee({ memberId, amount: 100 });

            expect(await service.getCreditAmounts()).toEqual([
                expect.objectContaining({
                    creditAmount: 100,
                }),
            ]);
        });
    });

    describe('Pay fee', () => {
        let feeId: string;
        beforeEach(async () => {
            await hooks.onMemberRegistered({ memberId, memberName: 'Nina Jolt' });
            const _ = await service.addFee({ memberId, amount: 100 });
            feeId = _.feeId;
        });

        it('get credit amounts query should return decreased credit amount', async () => {
            await service.payFee({ memberId, feeId });

            expect(await service.getCreditAmounts()).toEqual([
                expect.objectContaining({
                    creditAmount: 0,
                }),
            ]);
        });
    });

    describe('On MemberRenamed event', () => {
        beforeEach(async () => {
            await hooks.onMemberRegistered({ memberId, memberName: 'Nina Jolt' });
        });

        it('get credit amounts query should return the updated member name', async () => {
            await hooks.onMemberRenamed({ memberId, memberName: 'Luna Jett' });

            expect(await service.getCreditAmounts()).toEqual([
                {
                    creditAmount: 0,
                    deleted: false,
                    memberId: 'foo-member-id',
                    memberName: 'Luna Jett',
                },
            ]);
        });
    });

    describe('On MemberDeleted event', () => {
        beforeEach(async () => {
            await hooks.onMemberRegistered({ memberId, memberName: 'Nina Jolt' });
        });

        it('get credit amounts query should return nothing', async () => {
            await hooks.onMemberDeleted({ memberId });

            expect(await service.getCreditAmounts()).toEqual([]);
        });
    });
});
