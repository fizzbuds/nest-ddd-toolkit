import { FeeId } from './ids/fee-id';
import { MemberId } from '../../member-registration/domain/ids/member-id';

export class MembershipFeesAggregate {
    constructor(
        readonly id: MemberId,
        private readonly fees: { feeId: FeeId; value: number }[] = [],
        private creditAmount: number = 0,
    ) {}

    public static create(id: MemberId) {
        return new MembershipFeesAggregate(id);
    }

    public addFee(number: number) {
        const feeId = FeeId.generate();
        this.fees.push({ feeId: feeId, value: number });
        this.creditAmount += number;
        return feeId;
    }
}
