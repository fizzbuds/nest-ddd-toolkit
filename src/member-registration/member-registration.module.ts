import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';
import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';
import { Module } from '@nestjs/common';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationRepoHooks } from './infrastructure/member-registration.repo-hooks';
import { CommandHandlers } from './commands';

import { QueryHandlers } from './queries';
import { MemberRegistrationQueryBus } from './infrastructure/member-registration.query-bus';

export const MemberRegistrationProviders = [
    MemberRegistrationRepoHooks,
    MemberRegistrationAggregateRepo,
    MemberRegistrationQueryRepo,
    ...CommandHandlers,
    MemberRegistrationQueryBus,
    ...QueryHandlers,
];

@Module({
    imports: [],
    controllers: [MemberRegistrationController],
    providers: MemberRegistrationProviders,
    exports: [MemberRegistrationQueryBus],
})
export class MemberRegistrationModule {}
