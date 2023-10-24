import { MembershipFeesAggregateRepo } from './infrastructure/membership-fees-aggregate.repo';

import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hooks';
import { MemberFeesQueries } from './member-fees-queries.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MembershipFeesController } from './api/membership-fees.controller';
import { MembershipFeesCommands } from './membership-fees.commands';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query-repo.service';

@Module({
    controllers: [MembershipFeesController],
    providers: [
        MembershipFeesCommands,
        MemberFeesQueries,
        MemberFeesRepoHooks,
        {
            provide: MembershipFeesAggregateRepo,
            inject: [getConnectionToken(), MemberFeesRepoHooks],
            useFactory: MembershipFeesAggregateRepo.providerFactory,
        },
        {
            provide: MemberFeesQueryRepo,
            inject: [getConnectionToken()],
            useFactory: (conn: Connection) => {
                return new MemberFeesQueryRepo(conn.getClient(), 'member_fees_query_repo');
            },
        },
    ],
    //imports: [MemberRegistrationModule],
})
export class MembershipFeesModule {}
