import { MemberFeesAggregate } from './member-fees.aggregate';
import { v4 as uuidV4 } from 'uuid';

describe('MemberFeesAggregate', () => {
    describe('Given a MemberFeesAggregate', () => {
        let memberFeesAggregate: MemberFeesAggregate;
        beforeEach(() => {
            memberFeesAggregate = MemberFeesAggregate.create(uuidV4());
        });

        describe('When issuing a fee', () => {
            it('should increase the credit amount', () => {
                memberFeesAggregate.issueFee(100);

                expect(memberFeesAggregate).toMatchObject({
                    creditAmount: 100,
                });
            });
        });

        describe('Given a fee', () => {
            let feeId: string;
            beforeEach(() => {
                feeId = memberFeesAggregate.issueFee(123);
            });

            describe('When voiding it', () => {
                it('should mark it as voided', () => {
                    memberFeesAggregate.voidFee(feeId);

                    expect(memberFeesAggregate.getFee(feeId).voided).toBeTruthy();
                });
                it('should decrease the credit amount', () => {
                    memberFeesAggregate.voidFee(feeId);

                    expect(memberFeesAggregate.getCreditAmount()).toBe(0);
                });
            });

            describe('When pay it', () => {
                it('should mark it as paid', () => {
                    memberFeesAggregate.payFee(feeId);

                    expect(memberFeesAggregate.getFee(feeId).paid).toBeTruthy();
                });
                it('should decrease the credit amount', () => {
                    memberFeesAggregate.payFee(feeId);

                    expect(memberFeesAggregate.getCreditAmount()).toBe(0);
                });
            });
        });
    });
});
