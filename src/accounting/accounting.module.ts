import { MemberFeesAggregateRepo } from './infrastructure/member-fees-aggregate.repo';
import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hooks';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query.repo';
import { RegistrationModule } from '../registration/registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { MemberFeesCommandHandlers } from './commands';
import { MemberFeesQueryBus } from './infrastructure/member-fees-query-bus.service';
import { MemberFeesQueryHandlers } from './queries';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    MemberFeesQueryRepo,
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
