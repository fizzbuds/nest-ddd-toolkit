import { MembershipFeesAggregateRepo } from './infrastructure/membership-fees-aggregate.repo';
import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hooks';
import { Module } from '@nestjs/common';
import { MembershipFeesController } from './api/membership-fees.controller';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query.repo';
import { MemberRegistrationModule } from '../member-registration/member-registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { CommandHandlers } from './commands';
import { MembershipFeesQueryBus } from './infrastructure/membership-fees.query-bus';
import { MembershipFeesQueryHandlers } from './queries';

export const MembershipFeesProviders = [
    MemberFeesRepoHooks,
    MembershipFeesAggregateRepo,
    MemberFeesQueryRepo,
    MemberDeletedPolicy,
    ...CommandHandlers,
    MembershipFeesQueryBus,
    ...MembershipFeesQueryHandlers,
];

@Module({
    controllers: [MembershipFeesController],
    providers: MembershipFeesProviders,
    imports: [MemberRegistrationModule],
})
export class MembershipFeesModule {}
