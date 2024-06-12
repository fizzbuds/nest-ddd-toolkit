import { MemberFeesAggregateRepo } from './infrastructure/member-fees-aggregate.repo';
import { MemberFeesRepoHooks } from './infrastructure/member-fees-repo-hook.service';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { RegistrationModule } from '../registration/registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { MemberFeesCommandHandlers } from './commands';
import { MemberFeesQueryBus } from './infrastructure/member-fees-query-bus.service';
import { MemberFeesQueryHandlers } from './queries';
import { FeesQueryRepo } from './infrastructure/fees-query.repo';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    FeesQueryRepo,
    MemberDeletedPolicy,
    ...MemberFeesCommandHandlers,
    MemberFeesQueryBus,
    ...MemberFeesQueryHandlers,
];

@Module({
    controllers: [MemberFeesController],
    providers: AccountingProviders,
    imports: [RegistrationModule],
})
export class AccountingModule {}
