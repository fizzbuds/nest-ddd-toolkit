import { MemberAggregateRepo } from './@infra/member.aggregate-repo';
import { Module } from '@nestjs/common';
import { MembersController } from './api/members.controller';
import { MembersService } from './members.service';
import { AccountingModule } from '../accounting/accounting.module';

export const RegistrationProviders = [MemberAggregateRepo, MembersService];

@Module({
    imports: [AccountingModule],
    controllers: [MembersController],
    providers: RegistrationProviders,
    exports: [MembersService],
})
export class RegistrationModule {}
