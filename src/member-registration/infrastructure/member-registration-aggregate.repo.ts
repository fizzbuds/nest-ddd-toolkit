import { MemberRegistrationRepoHooks } from './member-registration.repo-hooks';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberRegistrationSerializer } from './member-registration.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger } from '@nestjs/common';
import { InjectMongo } from '@golee/mongo-nest';
import { MongoClient } from 'mongodb';

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

    constructor(@InjectMongo() mongoClient: MongoClient, memberRegistrationRepoHooks: MemberRegistrationRepoHooks) {
        super(
            new MemberRegistrationSerializer(),
            mongoClient,
            'member_registration_aggregate',
            undefined,
            memberRegistrationRepoHooks,
            MemberRegistrationAggregateRepo.logger,
        );
    }
}
