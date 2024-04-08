import { v4 as uuidV4 } from 'uuid';

export type Fee = { feeId: string; value: number; deleted: boolean };

export class MembershipFeesAggregate {
    constructor(readonly id: string, private readonly fees: Fee[] = [], private creditAmount = 0) {}

    public static create(id: string) {
        return new MembershipFeesAggregate(id);
    }

    public addFee(number: number) {
        const feeId = uuidV4();
        this.fees.push({ feeId: feeId, value: number, deleted: false });
        this.creditAmount += number;
        return feeId;
    }

    public deleteFee(feeId: string) {
        const fee = this.getFee(feeId);
        fee.deleted = true;

        this.creditAmount -= fee.value;
    }

    public getFee(feeId: string): Fee {
        const result = this.fees.find(({ feeId }) => feeId === feeId);
        if (!result) throw new Error(`Cannot find fee with id: ${feeId.toString()}`);
        return result;
    }

    public getCreditAmount(): number {
        return this.creditAmount;
    }

    public deleteAllFees() {
        this.fees.forEach((fee) => {
            fee.deleted = true;
        });
        this.creditAmount = 0;
    }
}
