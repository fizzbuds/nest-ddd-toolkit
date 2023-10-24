import { MembershipFeesAggregate } from './membership-fees.aggregate';
import { MemberId } from '../../member-registration/domain/ids/member-id';

describe('MembershipFeesAggregate', () => {
    describe('Given a MembershipFeesAggregate', () => {
        let membershipFeesAggregate: MembershipFeesAggregate;
        beforeEach(() => {
            membershipFeesAggregate = MembershipFeesAggregate.create(MemberId.generate());
        });
        describe('When adding a fee', () => {
            beforeEach(() => {
                membershipFeesAggregate.addFee(100);
            });

            it('should increase the credit amount', () => {
                expect(membershipFeesAggregate).toMatchObject({
                    fees: expect.anything(),
                    creditAmount: 100,
                });
            });
        });
    });
});
