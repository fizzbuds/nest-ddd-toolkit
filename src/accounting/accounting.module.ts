import { MemberFeesAggregateRepo } from './@infra/member-fees.aggregate-repo';
import { MemberFeesRepoHooks } from './@infra/member-fees.repo-hook';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { RegistrationModule } from '../registration/registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { AccountingQueryBus } from './@infra/accounting.query-bus';
import { FeeQueryRepo } from './read-models/fee.query-repo';
import { AddFeeCommandHandler } from './commands/add-fee.command-handler';
import { DeleteAllFeeCommandHandler } from './commands/delete-all-fee.command-handler';
import { DeleteFeeCommandHandler } from './commands/delete-fee.command-handler';
import { GetFeesQueryHandler } from './queries/get-fees.query-handler';
import { PayFeeCommandHandler } from './commands/pay-fee.command-handler';
import { AccountingCommandBus } from './@infra/accounting.command-bus';
import { CreditAmountQueryRepo } from './read-models/credit-amount.query-repo';
import { MemberRegisteredEventHandler } from './read-models/member-registered.event-handler';
import { MemberDeletedEventHandler } from './read-models/member-deleted.event-handler';
import { FeesController } from './api/fees.controller';
import { CreditAmountController } from './api/credit-amount.controller';
import { GetCreditAmountsQueryHandler } from './queries/get-credit-amounts.query-handler';
import { MemberRenamedEventHandler } from './read-models/member-renamed.event-handler';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    FeeQueryRepo,
    MemberDeletedPolicy,
    AccountingQueryBus,
    CreditAmountQueryRepo,
    AccountingCommandBus,
    ...[GetFeesQueryHandler, GetCreditAmountsQueryHandler],
    ...[AddFeeCommandHandler, DeleteAllFeeCommandHandler, DeleteFeeCommandHandler, PayFeeCommandHandler],
    ...[MemberRegisteredEventHandler, MemberDeletedEventHandler, MemberRenamedEventHandler],
];

@Module({
    controllers: [MemberFeesController, FeesController, CreditAmountController],
    providers: AccountingProviders,
    imports: [RegistrationModule],
})
export class AccountingModule {}
