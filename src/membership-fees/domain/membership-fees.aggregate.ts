import { MembershipFeesId } from './membership-fees-id';
import { FeeId } from './fee-id';

export class MembershipFeesAggregate {
    constructor(readonly id: MembershipFeesId, private readonly fees: { feeId: FeeId; value: number }[] = []) {}

    public static create(id: MembershipFeesId) {
        return new MembershipFeesAggregate(id);
    }

    public addFee(number: number) {
        const feeId = FeeId.generate();
        this.fees.push({ feeId: feeId, value: number });
        return feeId;
    }
}
