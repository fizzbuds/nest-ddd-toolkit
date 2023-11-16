import { Connection } from 'mongoose';
import { MemberRegistrationRepoHooks } from './member-registration.repo-hooks';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberRegistrationSerializer } from './member-registration.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';

export interface MemberRegistrationAggregateModel {
    id: string;
    name: string;
}

export class MemberRegistrationAggregateRepo {
    public static providerFactory(conn: Connection, memberRegistrationRepoHooks: MemberRegistrationRepoHooks) {
        return new MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>(
            new MemberRegistrationSerializer(),
            conn.getClient(),
            'member_registration_aggregate',
            memberRegistrationRepoHooks,
        );
    }
}
