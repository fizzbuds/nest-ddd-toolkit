import { MemberFeesAggregateRepo } from './infrastructure/member-fees.aggregate-repo';
import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hook';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { RegistrationModule } from '../registration/registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { MemberFeesQueryBus } from './infrastructure/member-fees.query-bus';
import { FeesQueryRepo } from './infrastructure/fees.query-repo';
import { AddFeeCommandHandler } from './commands/add-fee.command-handler';
import { DeleteAllFeeCommandHandler } from './commands/delete-all-fee.command-handler';
import { DeleteFeeCommandHandler } from './commands/delete-fee.command-handler';
import { GetMemberFeesQueryHandler } from './queries/get-member-fees.query-handler';
import { PayFeeCommandHandler } from './commands/pay-fee.command-handler';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    FeesQueryRepo,
    MemberDeletedPolicy,
    MemberFeesQueryBus,
    ...[GetMemberFeesQueryHandler],
    ...[AddFeeCommandHandler, DeleteAllFeeCommandHandler, DeleteFeeCommandHandler, PayFeeCommandHandler],
];

@Module({
    controllers: [MemberFeesController],
    providers: AccountingProviders,
    imports: [RegistrationModule],
})
export class AccountingModule {}
