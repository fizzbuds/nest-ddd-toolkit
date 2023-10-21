export const membershipFeesAggregateRepo = 'MembershipFeesAggregateRepo'; // This variable must be defined before imports

import { MemberFeesQueries } from './member-fees-queries.service';
import { MembershipFeesAggregateModel } from './infrastructure/membership-fees-aggregate.model';
import { getConnectionToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MongoAggregateRepo } from '../common';
import { MembershipFeesController } from './api/membership-fees.controller';
import { MembershipFeesCommands } from './membership-fees.commands';
import { MembershipFeesAggregate } from './domain/membership-fees.aggregate';
import { MembershipFeesSerializer } from './infrastructure/membership-fees.serializer';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query-repo.service';

@Module({
    controllers: [MembershipFeesController],
    providers: [
        MembershipFeesCommands,
        MemberFeesQueries,
        {
            provide: membershipFeesAggregateRepo,
            inject: [getConnectionToken()],
            useFactory: (conn: Connection) => {
                return new MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>(
                    new MembershipFeesSerializer(),
                    conn.getClient(),
                    'membership_fees_aggregate',
                );
            },
        },
        {
            provide: MemberFeesQueryRepo,
            inject: [getConnectionToken()],
            useFactory: (conn: Connection) => {
                return new MemberFeesQueryRepo(conn.getClient(), 'member_fees_query_repo');
            },
        },
    ],
})
export class MembershipFeesModule {}
