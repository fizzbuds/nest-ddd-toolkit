import { MemberAggregateRepo } from './infrastructure/member.aggregate-repo';
import { MemberQueryRepo } from './infrastructure/member.query-repo';
import { Module } from '@nestjs/common';
import { MembersController } from './api/members.controller';
import { MemberRepoHooks } from './infrastructure/member.repo-hooks';
import { MembersService } from './members.service';

export const RegistrationProviders = [MemberRepoHooks, MemberAggregateRepo, MemberQueryRepo, MembersService];

@Module({
    imports: [],
    controllers: [MembersController],
    providers: RegistrationProviders,
    exports: [MembersService],
})
export class RegistrationModule {}
