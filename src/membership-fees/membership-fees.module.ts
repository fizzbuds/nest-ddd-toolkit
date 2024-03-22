import { MembershipFeesAggregateRepo } from './infrastructure/membership-fees-aggregate.repo';

import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hooks';
import { MemberFeesQueries } from './member-fees-queries.service';
import { Module } from '@nestjs/common';
import { MembershipFeesController } from './api/membership-fees.controller';
import { MembershipFeesCommands } from './membership-fees.commands';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query.repo';
import { MemberRegistrationModule } from '../member-registration/member-registration.module';

@Module({
    controllers: [MembershipFeesController],
    providers: [
        MembershipFeesCommands,
        MemberFeesQueries,
        MemberFeesRepoHooks,
        MembershipFeesAggregateRepo,
        MemberFeesQueryRepo,
    ],
    imports: [MemberRegistrationModule],
})
export class MembershipFeesModule {}
