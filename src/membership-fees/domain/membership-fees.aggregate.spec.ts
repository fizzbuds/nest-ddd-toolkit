import { MembershipFeesAggregate } from './membership-fees.aggregate';
import { v4 as uuidV4 } from 'uuid';

describe('MembershipFeesAggregate', () => {
    describe('Given a MembershipFeesAggregate', () => {
        let membershipFeesAggregate: MembershipFeesAggregate;
        beforeEach(() => {
            membershipFeesAggregate = MembershipFeesAggregate.create(uuidV4());
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

        describe('Given a fee', () => {
            let feeId: string;
            beforeEach(() => {
                feeId = membershipFeesAggregate.addFee(123);
            });
            describe('When deleting it', () => {
                it('should mark it as deleted', () => {
                    membershipFeesAggregate.deleteFee(feeId);

                    expect(membershipFeesAggregate.getFee(feeId).deleted).toBeTruthy();
                });
                it('should decrease the credit amount', () => {
                    membershipFeesAggregate.deleteFee(feeId);

                    expect(membershipFeesAggregate.getCreditAmount()).toBe(0);
                });
            });
        });
    });
});
