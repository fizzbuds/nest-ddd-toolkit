import { Test, TestingModule } from '@nestjs/testing';
import { MemberUnregisteredPolicy } from './member-unregistered.policy';
import { MemberUnregistered } from '../../registration/events/member-unregistered.event';
import { AccountingService } from '../accounting.service';
import { EventBusModule } from '../../@infra/event-bus/event-bus.module';

describe('MemberUnregisteredPolicy', () => {
    let policy: MemberUnregisteredPolicy;
    let mockedService: { voidAllFees: jest.Mock };

    beforeEach(async () => {
        mockedService = { voidAllFees: jest.fn().mockResolvedValue(true) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MemberUnregisteredPolicy, AccountingService],
            imports: [EventBusModule],
        })
            .overrideProvider(AccountingService)
            .useValue(mockedService)
            .compile();

        policy = module.get<MemberUnregisteredPolicy>(MemberUnregisteredPolicy);
    });

    it('should handle MemberUnregistered event, call service.voidAllFees', async () => {
        const event = new MemberUnregistered({ memberId: 'abc' });
        await policy.handle(event);

        expect(mockedService.voidAllFees).toHaveBeenCalledWith({ memberId: 'abc' });
    });
});
