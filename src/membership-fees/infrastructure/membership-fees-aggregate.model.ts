import { FeeId } from '../domain/ids/fee-id';

export interface MembershipFeesAggregateModel {
    id: string;
    fees: { feeId: FeeId; value: number }[];
}
