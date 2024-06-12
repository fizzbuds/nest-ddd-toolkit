import { MemberAggregateRepo } from './infrastructure/member.aggregate-repo';
import { Module } from '@nestjs/common';
import { MembersController } from './api/members.controller';
import { MembersService } from './members.service';

export const RegistrationProviders = [MemberAggregateRepo, MembersService];

@Module({
    imports: [],
    controllers: [MembersController],
    providers: RegistrationProviders,
    exports: [MembersService],
})
export class RegistrationModule {}
