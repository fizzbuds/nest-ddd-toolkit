import { Connection } from 'mongoose';
import { MemberFeesRepoHooks } from './member-fees.repo-hooks';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MembershipFeesSerializer } from './membership-fees.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

export interface MembershipFeesAggregateModel {
    id: string;
    fees: { feeId: string; value: number; deleted: boolean }[];
    creditAmount: number;
}

export class MembershipFeesAggregateRepo extends MongoAggregateRepo<
    MembershipFeesAggregate,
    MembershipFeesAggregateModel
> {
    private static logger = new Logger(MembershipFeesAggregateRepo.name);

    constructor(@InjectConnection() conn: Connection, memberFeesRepoHooks: MemberFeesRepoHooks) {
        super(
            new MembershipFeesSerializer(),
            conn.getClient(),
            'membership_fees_aggregate',
            undefined,
            memberFeesRepoHooks,
            MembershipFeesAggregateRepo.logger,
        );
    }
}
