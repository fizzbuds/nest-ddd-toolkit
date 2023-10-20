export const memberRegistrationAggregateRepo = 'MemberRegristrationAggregateRepo'; // This variable must be defined before imports

import { MemberRegistrationAggregateModel } from './infrastructure/member-registration-aggregate.model';
import { getConnectionToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MongoAggregateRepo } from '../common';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationCommands } from './member-registration.commands';
import { MemberRegistrationAggregate } from './domain/member-registration.aggregate';
import { MemberRegistrationSerializer } from './infrastructure/member-registration.serializer';

@Module({
    controllers: [MemberRegistrationController],
    providers: [
        MemberRegistrationCommands,
        {
            provide: memberRegistrationAggregateRepo,
            inject: [getConnectionToken()],
            useFactory: (conn: Connection) => {
                return new MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>(
                    new MemberRegistrationSerializer(),
                    conn.getClient(),
                    'membership_fees_aggregate',
                );
            },
        },
    ],
})
export class MemberRegistrationModule {}
