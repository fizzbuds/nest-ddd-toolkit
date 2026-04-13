import { FeesEntity } from './fees.entity';

export class MemberFeesAggregate {
    constructor(readonly id: string, private readonly feesEntity = new FeesEntity(), private creditAmount = 0) {}

    public static create(id: string) {
        return new MemberFeesAggregate(id);
    }

    public issueFee(value: number) {
        const { feeId } = this.feesEntity.issue(value);

        this.creditAmount += value;
        return feeId;
    }

    public voidFee(feeId: string) {
        this.feesEntity.void(feeId);

        const fee = this.getFee(feeId);
        this.creditAmount -= fee.value;
    }

    public getFee(feeId: string) {
        return this.feesEntity.get(feeId);
    }

    public getCreditAmount(): number {
        return this.creditAmount;
    }

    public voidAllFees() {
        this.feesEntity.voidAll();
        this.creditAmount = 0;
    }

    public payFee(feeId: string) {
        this.feesEntity.pay(feeId);

        const fee = this.getFee(feeId);
        this.creditAmount -= fee.value;
    }
}
