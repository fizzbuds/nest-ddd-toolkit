import { Test, TestingModule } from '@nestjs/testing';
import { MemberDeletedPolicy } from './member-deleted.policy';
import { MemberDeleted } from '../../registration/events/member-deleted.event';
import { AccountingService } from '../accounting.service';
import { EventBusModule } from '../../@infra/event-bus/event-bus.module';

describe('MemberDeletedPolicy', () => {
    let policy: MemberDeletedPolicy;
    let mockedService: { deleteAllFees: jest.Mock };

    beforeEach(async () => {
        mockedService = { deleteAllFees: jest.fn().mockResolvedValue(true) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MemberDeletedPolicy, AccountingService],
            imports: [EventBusModule],
        })
            .overrideProvider(AccountingService)
            .useValue(mockedService)
            .compile();

        policy = module.get<MemberDeletedPolicy>(MemberDeletedPolicy);
    });

    it('should handle MemberDeleted event, call service.deleteAllFees', async () => {
        const event = new MemberDeleted({ memberId: 'abc' });
        await policy.handle(event);

        expect(mockedService.deleteAllFees).toHaveBeenCalledWith({ memberId: 'abc' });
    });
});
