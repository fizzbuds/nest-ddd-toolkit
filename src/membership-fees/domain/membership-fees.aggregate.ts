import { FeeId } from './ids/fee-id';
import { MemberId } from '../../member-registration/domain/ids/member-id';
import { Error } from 'mongoose';

export type Fee = { feeId: FeeId; value: number; deleted: boolean };

export class MembershipFeesAggregate {
    constructor(readonly id: MemberId, private readonly fees: Fee[] = [], private creditAmount = 0) {}

    public static create(id: MemberId) {
        return new MembershipFeesAggregate(id);
    }

    public addFee(number: number) {
        const feeId = FeeId.generate();
        this.fees.push({ feeId: feeId, value: number, deleted: false });
        this.creditAmount += number;
        return feeId;
    }

    public deleteFee(feeId: FeeId) {
        const fee = this.getFee(feeId);
        fee.deleted = true;
    }

    public getFee(feeId: FeeId): Fee {
        const result = this.fees.find((fee) => fee.feeId.equals(feeId));
        if (!result) throw new Error(`Cannot find fee with id: ${feeId.toString()}`);
        return result;
    }

    public getCreditAmount(): number {
        return this.creditAmount;
    }
}
