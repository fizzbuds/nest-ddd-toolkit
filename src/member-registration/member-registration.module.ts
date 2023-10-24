import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';

import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';
import { MemberRegistrationQueries } from './member-registration.queries';
import { getConnectionToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationCommands } from './member-registration.commands';
import { MemberRegistrationRepoHooks } from './infrastructure/member-registration.repo-hooks';

export const memberRegistrationProviders = [
    MemberRegistrationCommands,
    MemberRegistrationQueries,
    MemberRegistrationRepoHooks,
    {
        provide: MemberRegistrationAggregateRepo,
        inject: [getConnectionToken(), MemberRegistrationRepoHooks],
        useFactory: MemberRegistrationAggregateRepo.providerFactory,
    },
    {
        provide: MemberRegistrationQueryRepo,
        inject: [getConnectionToken()],
        useFactory: (conn: Connection) => {
            return new MemberRegistrationQueryRepo(conn.getClient(), 'member_query_repo');
        },
    },
];

@Module({
    controllers: [MemberRegistrationController],
    providers: memberRegistrationProviders,
    exports: [MemberRegistrationQueries],
})
export class MemberRegistrationModule {}
