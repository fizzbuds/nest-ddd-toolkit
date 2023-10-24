import { Connection } from 'mongoose';
import { MemberFeesRepoHooks } from './member-fees.repo-hooks';
import { MongoAggregateRepo } from '../../common';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MembershipFeesSerializer } from './membership-fees.serializer';
import { FeeId } from '../domain/ids/fee-id';

export interface MembershipFeesAggregateModel {
    id: string;
    fees: { feeId: FeeId; value: number }[];
}

export class MembershipFeesAggregateRepo {
    public static providerFactory(conn: Connection, memberFeesRepoHooks: MemberFeesRepoHooks) {
        return new MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>(
            new MembershipFeesSerializer(),
            conn.getClient(),
            'membership_fees_aggregate',
            memberFeesRepoHooks,
        );
    }
}
