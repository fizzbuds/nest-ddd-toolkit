import { Connection } from 'mongoose';
import { MemberRegistrationRepoHooks } from './member-registration.repo-hooks';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberRegistrationSerializer } from './member-registration.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

export interface MemberRegistrationAggregateModel {
    id: string;
    name: string;
    deleted: boolean;
}

export class MemberRegistrationAggregateRepo extends MongoAggregateRepo<
    MemberRegistrationAggregate,
    MemberRegistrationAggregateModel
> {
    private static logger = new Logger(MemberRegistrationAggregateRepo.name);

    constructor(@InjectConnection() conn: Connection, memberRegistrationRepoHooks: MemberRegistrationRepoHooks) {
        super(
            new MemberRegistrationSerializer(),
            conn.getClient(),
            'member_registration_aggregate',
            undefined,
            memberRegistrationRepoHooks,
            MemberRegistrationAggregateRepo.logger,
        );
    }
}
