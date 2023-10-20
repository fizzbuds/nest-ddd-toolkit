import { MembershipFeesId } from './ids/membership-fees-id';
import { FeeId } from './ids/fee-id';

export class MembershipFeesAggregate {
    constructor(
        readonly id: MembershipFeesId,
        private readonly fees: { feeId: FeeId; value: number }[] = [],
        private creditAmount: number = 0,
    ) {}

    public static create(id: MembershipFeesId) {
        return new MembershipFeesAggregate(id);
    }

    public addFee(number: number) {
        const feeId = FeeId.generate();
        this.fees.push({ feeId: feeId, value: number });
        this.creditAmount += number;
        return feeId;
    }
}
