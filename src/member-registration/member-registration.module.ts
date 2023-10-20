export const memberRegistrationAggregateRepo = 'MemberRegristrationAggregateRepo'; // This variable must be defined before imports

import { MemberRegistrationQueries } from './member-registration.queries';
import { MemberRegistrationAggregateModel } from './infrastructure/member-registration-aggregate.model';
import { getConnectionToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MongoAggregateRepo } from '../common';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationCommands } from './member-registration.commands';
import { MemberRegistrationAggregate } from './domain/member-registration.aggregate';
import { MemberRegistrationSerializer } from './infrastructure/member-registration.serializer';
import { MemberRegistrationRepoHooks } from './infrastructure/member-registration.repo-hooks';
import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';

export const memberRegistrationProviders = [
    MemberRegistrationCommands,
    MemberRegistrationQueries,
    MemberRegistrationRepoHooks,
    {
        provide: memberRegistrationAggregateRepo,
        inject: [getConnectionToken(), MemberRegistrationRepoHooks],
        useFactory: (conn: Connection, memberRegistrationRepoHooks: MemberRegistrationRepoHooks) => {
            return new MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>(
                new MemberRegistrationSerializer(),
                conn.getClient(),
                'membership_fees_aggregate',
                memberRegistrationRepoHooks,
            );
        },
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
