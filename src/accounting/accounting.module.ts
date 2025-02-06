import { MemberFeesAggregateRepo } from './@infra/member-fees.aggregate-repo';
import { MemberFeesRepoHooks } from './@infra/member-fees.repo-hook';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { FeeQueryRepo } from './read-models/fee.query-repo';
import { CreditAmountQueryRepo } from './read-models/credit-amount.query-repo';
import { FeesController } from './api/fees.controller';
import { CreditAmountController } from './api/credit-amount.controller';
import { AccountingService } from './accounting.service';
import { AccountingHooks } from './accounting.hooks';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    FeeQueryRepo,
    CreditAmountQueryRepo,
    AccountingService,
    AccountingHooks,
];

@Module({
    controllers: [MemberFeesController, FeesController, CreditAmountController],
    providers: AccountingProviders,
    exports: [AccountingHooks],
})
export class AccountingModule {}
