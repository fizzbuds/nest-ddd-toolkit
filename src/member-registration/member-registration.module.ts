import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';
import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';
import { Module } from '@nestjs/common';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationRepoHooks } from './infrastructure/member-registration.repo-hooks';
import { CommandHandlers } from './commands';
import {
    MEMBER_REGISTRATION_QUERY_BUS,
    MemberRegistrationQueryBusProvider,
} from './infrastructure/member-registration.query-bus';
import { QueryHandlers } from './queries';

export const MemberRegistrationProviders = [
    MemberRegistrationRepoHooks,
    MemberRegistrationAggregateRepo,
    MemberRegistrationQueryRepo,
    ...CommandHandlers,
    MemberRegistrationQueryBusProvider,
    ...QueryHandlers,
];

@Module({
    imports: [],
    controllers: [MemberRegistrationController],
    providers: MemberRegistrationProviders,
    exports: [MEMBER_REGISTRATION_QUERY_BUS],
})
export class MemberRegistrationModule {}
