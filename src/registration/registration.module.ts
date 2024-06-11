import { MemberAggregateRepo } from './infrastructure/member-aggregate.repo';
import { MemberQueryRepo } from './infrastructure/member-query.repo';
import { Module } from '@nestjs/common';
import { MembersController } from './api/members.controller';
import { MemberRepoHooks } from './infrastructure/member.repo-hooks';
import { CommandHandlers } from './commands';

import { QueryHandlers } from './queries';
import { MemberQueryBus } from './infrastructure/member.query-bus';

export const RegistrationProviders = [
    MemberRepoHooks,
    MemberAggregateRepo,
    MemberQueryRepo,
    ...CommandHandlers,
    MemberQueryBus,
    ...QueryHandlers,
];

@Module({
    imports: [],
    controllers: [MembersController],
    providers: RegistrationProviders,
    exports: [MemberQueryBus],
})
export class RegistrationModule {}
