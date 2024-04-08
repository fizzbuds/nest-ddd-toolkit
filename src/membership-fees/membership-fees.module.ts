import { MembershipFeesAggregateRepo } from './infrastructure/membership-fees-aggregate.repo';

import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hooks';
import { MemberFeesQueries } from './member-fees-queries.service';
import { Module } from '@nestjs/common';
import { MembershipFeesController } from './api/membership-fees.controller';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query.repo';
import { MemberRegistrationModule } from '../member-registration/member-registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { CommandHandlers } from './commands/handlers';

@Module({
    controllers: [MembershipFeesController],
    providers: [
        MemberFeesQueries,
        MemberFeesRepoHooks,
        MembershipFeesAggregateRepo,
        MemberFeesQueryRepo,
        MemberDeletedPolicy,
        ...CommandHandlers,
    ],
    imports: [MemberRegistrationModule],
})
export class MembershipFeesModule {}
