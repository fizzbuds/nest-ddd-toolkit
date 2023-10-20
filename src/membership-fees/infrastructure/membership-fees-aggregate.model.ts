import { FeeId } from '../domain/fee-id';

export interface MembershipFeesAggregateModel {
    id: string;
    fees: { feeId: FeeId; value: number }[];
}
