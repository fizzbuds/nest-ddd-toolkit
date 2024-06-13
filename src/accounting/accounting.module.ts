import { MemberFeesAggregateRepo } from './infrastructure/member-fees.aggregate-repo';
import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hook';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { RegistrationModule } from '../registration/registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { AccountingQueryBus } from './infrastructure/accounting.query-bus';
import { FeeQueryRepo } from './read-models/fee.query-repo';
import { AddFeeCommandHandler } from './commands/add-fee.command-handler';
import { DeleteAllFeeCommandHandler } from './commands/delete-all-fee.command-handler';
import { DeleteFeeCommandHandler } from './commands/delete-fee.command-handler';
import { GetFeesQueryHandler } from './queries/get-fees.query-handler';
import { PayFeeCommandHandler } from './commands/pay-fee.command-handler';
import { AccountingCommandBus } from './infrastructure/accounting.command-bus';
import { FeesController } from './api/fees.controller';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    FeeQueryRepo,
    MemberDeletedPolicy,
    AccountingQueryBus,
    AccountingCommandBus,
    ...[GetFeesQueryHandler],
    ...[AddFeeCommandHandler, DeleteAllFeeCommandHandler, DeleteFeeCommandHandler, PayFeeCommandHandler],
];

@Module({
    controllers: [MemberFeesController, FeesController],
    providers: AccountingProviders,
    imports: [RegistrationModule],
})
export class AccountingModule {}
