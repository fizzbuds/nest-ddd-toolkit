import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { MemberRenamedEventHandler } from './member-renamed.event-handler';
import { CreditAmountQueryRepo } from './credit-amount.query-repo';
import { MemberRenamed } from '../../registration/events/member-renamed.event';

describe('MemberRenamedEventHandler', () => {
    let eventHandler: MemberRenamedEventHandler;
    const CreditAmountQueryRepoMock = { onMemberRenamed: jest.fn() };

    beforeEach(async () => {
        eventHandler = new MemberRenamedEventHandler(
            { subscribe: () => true } as unknown as EventBus,
            CreditAmountQueryRepoMock as unknown as CreditAmountQueryRepo,
        );
    });

    it('should handle MemberRenamed event, call creditAmountQueryRepo.onMemberRenamed', async () => {
        const event = new MemberRenamed({ memberId: 'abc', memberName: 'John Doe' });
        await eventHandler.handle(event);

        expect(CreditAmountQueryRepoMock.onMemberRenamed).toHaveBeenCalledWith({
            memberId: 'abc',
            memberName: 'John Doe',
        });
    });
});
