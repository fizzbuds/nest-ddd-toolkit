import { Connection } from 'mongoose';
import { MemberRegistrationRepoHooks } from './member-registration.repo-hooks';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberRegistrationSerializer } from './member-registration.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger } from '@nestjs/common';

export interface MemberRegistrationAggregateModel {
    id: string;
    name: string;
    deleted: boolean;
}

export class MemberRegistrationAggregateRepo {
    private static logger = new Logger(MemberRegistrationAggregateRepo.name);

    public static providerFactory(conn: Connection, memberRegistrationRepoHooks: MemberRegistrationRepoHooks) {
        return new MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>(
            new MemberRegistrationSerializer(),
            conn.getClient(),
            'member_registration_aggregate',
            undefined,
            memberRegistrationRepoHooks,
            MemberRegistrationAggregateRepo.logger,
        );
    }
}
