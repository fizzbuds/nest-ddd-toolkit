import { v4 as uuidV4 } from 'uuid';

export type Fee = { feeId: string; value: number; voided: boolean; paid: boolean };

export class FeesEntity {
    constructor(private readonly fees: Fee[] = []) {}

    public issue(value: number) {
        const feeId = uuidV4();
        this.fees.push({ feeId: feeId, value, voided: false, paid: false });
        return { feeId };
    }

    public void(feeId: string) {
        const index = this.fees.findIndex(({ feeId: id }) => id === feeId);
        if (index === -1) throw new Error(`Cannot find fee with given id: ${feeId}`);

        this.fees[index].voided = true;
    }

    public get(feeId: string) {
        const fee = this.fees.find(({ feeId }) => feeId === feeId);
        if (!fee) throw new Error(`Cannot find fee with id: ${feeId}`);
        return fee;
    }

    public voidAll() {
        this.fees.forEach((fee) => {
            fee.voided = true;
        });
    }

    public pay(feeId: string) {
        const index = this.fees.findIndex(({ feeId: id }) => id === feeId);
        if (index === -1) throw new Error(`Cannot find fee with given id: ${feeId}`);

        this.fees[index].paid = true;
    }
}
