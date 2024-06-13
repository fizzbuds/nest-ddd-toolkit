import { MemberFeesAggregateRepo } from './infrastructure/member-fees.aggregate-repo';
import { Module } from '@nestjs/common';
import { MemberFeesController } from './api/member-fees.controller';
import { RegistrationModule } from '../registration/registration.module';
import { AddFeeCommandHandler } from './commands/add-fee.command-handler';
import { DeleteFeeCommandHandler } from './commands/delete-fee.command-handler';
import { PayFeeCommandHandler } from './commands/pay-fee.command-handler';
import { AccountingCommandBus } from './infrastructure/accounting.command-bus';

export const AccountingProviders = [
    MemberFeesAggregateRepo,

    AccountingCommandBus,
    ...[AddFeeCommandHandler, DeleteFeeCommandHandler, PayFeeCommandHandler],
];

@Module({
    controllers: [MemberFeesController],
    providers: AccountingProviders,
    imports: [RegistrationModule],
})
export class AccountingModule {}
