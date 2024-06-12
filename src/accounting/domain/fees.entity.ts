import { v4 as uuidV4 } from 'uuid';

export type Fee = { feeId: string; value: number; deleted: boolean };

export class FeesEntity {
    constructor(private readonly fees: Fee[] = []) {}

    public add(value: number) {
        const feeId = uuidV4();
        this.fees.push({ feeId: feeId, value, deleted: false });
        return { feeId };
    }

    public delete(feeId: string) {
        const index = this.fees.findIndex(({ feeId: id }) => id === feeId);
        if (index === -1) throw new Error(`Cannot find fee with given id: ${feeId}`);

        this.fees[index].deleted = true;
    }

    public get(feeId: string) {
        const fee = this.fees.find(({ feeId }) => feeId === feeId);
        if (!fee) throw new Error(`Cannot find fee with id: ${feeId}`);
        return fee;
    }

    public deleteAll() {
        this.fees.forEach((fee) => {
            fee.deleted = true;
        });
    }
}
