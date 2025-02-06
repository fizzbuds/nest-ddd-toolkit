import { MemberFeesAggregateRepo } from './@infra/member-fees.aggregate-repo';
import { MemberFeesRepoHooks } from './@infra/member-fees.repo-hook';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { RegistrationModule } from '../registration/registration.module';
import { MemberDeletedPolicy } from './policies/member-deleted.policy';
import { FeeQueryRepo } from './read-models/fee.query-repo';
import { CreditAmountQueryRepo } from './read-models/credit-amount.query-repo';
import { MemberRegisteredEventHandler } from './read-models/member-registered.event-handler';
import { MemberDeletedEventHandler } from './read-models/member-deleted.event-handler';
import { FeesController } from './api/fees.controller';
import { CreditAmountController } from './api/credit-amount.controller';
import { MemberRenamedEventHandler } from './read-models/member-renamed.event-handler';
import { AccountingService } from './accounting.service';

export const AccountingProviders = [
    MemberFeesRepoHooks,
    MemberFeesAggregateRepo,
    FeeQueryRepo,
    MemberDeletedPolicy,
    CreditAmountQueryRepo,
    AccountingService,
    ...[MemberRegisteredEventHandler, MemberDeletedEventHandler, MemberRenamedEventHandler],
];

@Module({
    controllers: [MemberFeesController, FeesController, CreditAmountController],
    providers: AccountingProviders,
    imports: [RegistrationModule],
})
export class AccountingModule {}
