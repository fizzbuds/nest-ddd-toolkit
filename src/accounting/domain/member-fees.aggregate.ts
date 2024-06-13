import { FeesEntity } from './fees.entity';

export class MemberFeesAggregate {
    constructor(readonly id: string, private readonly feesEntity = new FeesEntity()) {}

    public static create(id: string) {
        return new MemberFeesAggregate(id);
    }

    public addFee(number: number) {
        const { feeId } = this.feesEntity.add(number);

        return feeId;
    }

    public deleteFee(feeId: string) {
        this.feesEntity.delete(feeId);
    }

    public getFee(feeId: string) {
        return this.feesEntity.get(feeId);
    }

    public payFee(feeId: string) {
        this.feesEntity.pay(feeId);
    }
}
