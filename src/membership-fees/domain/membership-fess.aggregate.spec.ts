import { MembershipFeesAggregate } from './membership-fees.aggregate';
import { MembershipFeesId } from './ids/membership-fees-id';

describe('MembershipFeesAggregate', () => {
    describe('Given a MembershipFeesAggregate', () => {
        let membershipFeesAggregate: MembershipFeesAggregate;
        beforeEach(() => {
            membershipFeesAggregate = MembershipFeesAggregate.create(MembershipFeesId.generate());
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
