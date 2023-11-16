import { Connection } from 'mongoose';
import { MemberFeesRepoHooks } from './member-fees.repo-hooks';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MembershipFeesSerializer } from './membership-fees.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';

export interface MembershipFeesAggregateModel {
    id: string;
    fees: { feeId: string; value: number }[];
    creditAmount: number;
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
