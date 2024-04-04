import { MemberFeesRepoHooks } from './member-fees.repo-hooks';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MembershipFeesSerializer } from './membership-fees.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger } from '@nestjs/common';
import { InjectMongo } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';

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

    constructor(@InjectMongo() mongoClient: MongoClient, memberFeesRepoHooks: MemberFeesRepoHooks) {
        super(
            new MembershipFeesSerializer(),
            mongoClient,
            'membership_fees_aggregate',
            undefined,
            memberFeesRepoHooks,
            MembershipFeesAggregateRepo.logger,
        );
    }
}
