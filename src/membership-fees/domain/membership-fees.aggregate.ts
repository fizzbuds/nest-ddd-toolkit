import { FeesId } from './fees-id';

export class MembershipFeesAggregate {
    constructor(private readonly id: FeesId) {}

    public static create(id: FeesId) {
        return new MembershipFeesAggregate(id);
    }
}
