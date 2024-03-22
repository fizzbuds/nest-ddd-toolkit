import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';

import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';
import { MemberRegistrationQueries } from './member-registration.queries';
import { Module } from '@nestjs/common';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationCommands } from './member-registration.commands';
import { MemberRegistrationRepoHooks } from './infrastructure/member-registration.repo-hooks';

export const memberRegistrationProviders = [
    MemberRegistrationCommands,
    MemberRegistrationQueries,
    MemberRegistrationRepoHooks,
    MemberRegistrationAggregateRepo,
    MemberRegistrationQueryRepo,
];

@Module({
    controllers: [MemberRegistrationController],
    providers: memberRegistrationProviders,
    exports: [MemberRegistrationQueries],
})
export class MemberRegistrationModule {}
