import { MemberFeesAggregateRepo } from './infrastructure/member-fees.aggregate-repo';
import { MemberFeesRepoHooks } from './infrastructure/member-fees.repo-hook';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { RegistrationModule } from '../registration/registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { AccountingQueryBus } from './infrastructure/accounting.query-bus';
import { FeesQueryRepo } from './read-models/fees.query-repo';
import { AddFeeCommandHandler } from './commands/add-fee.command-handler';
import { DeleteAllFeeCommandHandler } from './commands/delete-all-fee.command-handler';
import { DeleteFeeCommandHandler } from './commands/delete-fee.command-handler';
import { GetFeesQueryHandler } from './queries/get-fees.query-handler';
import { PayFeeCommandHandler } from './commands/pay-fee.command-handler';
import { AccountingCommandBus } from './infrastructure/accounting.command-bus';
import { CreditAmountQueryRepo } from './read-models/credit-amount.query-repo';
import { MemberRegisteredEventHandler } from './read-models/member-registered.event-handler';
import { MemberDeletedEventHandler } from './read-models/member-deleted.event-handler';
import { FeesController } from './api/fees.controller';
import { CreditAmountController } from './api/credit-amount.controller';
import { GetCreditAmountsQueryHandler } from './queries/get-credit-amounts.query-handler';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    FeesQueryRepo,
    MemberDeletedPolicy,
    AccountingQueryBus,
    CreditAmountQueryRepo,
    AccountingCommandBus,
    ...[GetFeesQueryHandler, GetCreditAmountsQueryHandler],
    ...[AddFeeCommandHandler, DeleteAllFeeCommandHandler, DeleteFeeCommandHandler, PayFeeCommandHandler],
    ...[MemberRegisteredEventHandler, MemberDeletedEventHandler],
];

@Module({
    controllers: [MemberFeesController, FeesController, CreditAmountController],
    providers: AccountingProviders,
    imports: [RegistrationModule],
})
export class AccountingModule {}
