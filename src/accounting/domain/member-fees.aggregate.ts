import { FeesEntity } from './fees.entity';

export class MemberFeesAggregate {
    constructor(readonly id: string, private readonly feesEntity = new FeesEntity(), private creditAmount = 0) {}

    public static create(id: string) {
        return new MemberFeesAggregate(id);
    }

    public addFee(value: number) {
        const { feeId } = this.feesEntity.add(value);

        this.creditAmount += value;
        return feeId;
    }

    public deleteFee(feeId: string) {
        this.feesEntity.delete(feeId);

        const fee = this.getFee(feeId);
        this.creditAmount -= fee.value;
    }

    public getFee(feeId: string) {
        return this.feesEntity.get(feeId);
    }

    public getCreditAmount(): number {
        return this.creditAmount;
    }

    public deleteAllFees() {
        // TODO: implement delete all fees logic (use feesEntity.deleteAll())
    }

    public payFee(feeId: string) {
        this.feesEntity.pay(feeId);

        const fee = this.getFee(feeId);
        this.creditAmount -= fee.value;
    }
}
