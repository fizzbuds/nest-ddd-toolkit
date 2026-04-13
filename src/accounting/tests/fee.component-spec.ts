import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFeesAggregateRepo } from '../@infra/member-fees.aggregate-repo';
import { getMongoToken, MongoModule } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';
import { AccountingProviders } from '../accounting.module';
import { EventBusModule } from '../../@infra/event-bus/event-bus.module';
import { MembersService } from '../../registration/members.service';
import { AccountingService } from '../accounting.service';

describe('Fee Component Test', () => {
    let module: TestingModule;
    let mongodb: MongoMemoryReplSet;
    let service: AccountingService;

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
            imports: [MongoModule.forRoot({ uri: mongodb.getUri('test') }), EventBusModule],
        }).compile();

        await module.get(MemberFeesAggregateRepo).init();

        service = module.get(AccountingService);
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

    describe('Issue fee', () => {
        it('get fees query should return issued fee', async () => {
            await service.issueFee({ memberId, amount: 100 });

            expect(await service.getFees()).toEqual([
                expect.objectContaining({
                    voided: false,
                    memberId: 'foo-member-id',
                    paid: false,
                    value: 100,
                }),
            ]);
        });
    });

    describe('Pay fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await service.issueFee({ memberId, amount: 100 });
            feeId = _.feeId;
        });

        it('get fees query should return paid fee', async () => {
            await service.payFee({ memberId, feeId });

            expect(await service.getFees()).toEqual([
                expect.objectContaining({
                    voided: false,
                    memberId: 'foo-member-id',
                    paid: true,
                    value: 100,
                }),
            ]);
        });
    });

    describe('Void fee', () => {
        let feeId: string;
        beforeEach(async () => {
            const _ = await service.issueFee({ memberId, amount: 100 });
            feeId = _.feeId;
        });

        it('get fees query should return nothing', async () => {
            await service.voidFee({ memberId, feeId });

            expect(await service.getFees()).toEqual([]);
        });
    });
});
