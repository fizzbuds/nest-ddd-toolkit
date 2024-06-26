import { MemberFeesAggregate } from './member-fees.aggregate';
import { v4 as uuidV4 } from 'uuid';

describe('MemberFeesAggregate', () => {
    describe('Given a MemberFeesAggregate', () => {
        let memberFeesAggregate: MemberFeesAggregate;
        beforeEach(() => {
            memberFeesAggregate = MemberFeesAggregate.create(uuidV4());
        });

        describe('When adding a fee', () => {
            it('should increase the credit amount', () => {
                memberFeesAggregate.addFee(100);

                expect(memberFeesAggregate).toMatchObject({
                    creditAmount: 100,
                });
            });
        });

        describe('Given a fee', () => {
            let feeId: string;
            beforeEach(() => {
                feeId = memberFeesAggregate.addFee(123);
            });

            describe('When deleting it', () => {
                it('should mark it as deleted', () => {
                    memberFeesAggregate.deleteFee(feeId);

                    expect(memberFeesAggregate.getFee(feeId).deleted).toBeTruthy();
                });
                it('should decrease the credit amount', () => {
                    memberFeesAggregate.deleteFee(feeId);

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
