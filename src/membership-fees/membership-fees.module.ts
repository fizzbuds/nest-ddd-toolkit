export const membershipFeesAggregateRepo = 'MembershipFeesAggregateRepo'; // This variable must be defined before imports
import { getConnectionToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MongoAggregateRepo } from '../common';
import { MembershipFeesController } from './api/membership-fees.controller';
import { MembershipFeesCommands } from './membership-fees.commands';
import { MembershipFeesAggregate } from './domain/membership-fees.aggregate';
import { MembershipFeesSerializer } from './infrastructure/membership-fees.serializer';

@Module({
    controllers: [MembershipFeesController],
    providers: [
        MembershipFeesCommands,
        {
            provide: membershipFeesAggregateRepo,
            inject: [getConnectionToken()],
            useFactory: (conn: Connection) => {
                return new MongoAggregateRepo<MembershipFeesAggregate, MembershipFeesAggregateModel>(
                    new MembershipFeesSerializer(),
                    conn.getClient(),
                    'membership_fees_aggregate',
                );
            },
        },
    ],
})
export class ExampleModule {}
