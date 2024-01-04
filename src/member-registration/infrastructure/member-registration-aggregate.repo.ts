import { MemberRegistrationRepoHooks } from './member-registration.repo-hooks';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberRegistrationSerializer } from './member-registration.serializer';
import { MongoAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { MemberRegistrationOutbox } from './member-registration.outbox';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Connection } from 'mongoose';

export interface MemberRegistrationAggregateModel {
    id: string;
    name: string;
}

export class MemberRegistrationAggregateRepo {
    private static logger = new Logger(MemberRegistrationAggregateRepo.name);

    public static providerFactory(): Provider {
        return {
            provide: MemberRegistrationAggregateRepo,
            inject: [getConnectionToken(), MemberRegistrationRepoHooks, MemberRegistrationOutbox],
            useFactory: (conn: Connection, memberRegistrationRepoHooks, memberRegistrationOutbox) => {
                return new MongoAggregateRepo<MemberRegistrationAggregate, MemberRegistrationAggregateModel>(
                    new MemberRegistrationSerializer(),
                    conn.getClient(),
                    'member_registration_write_model',
                    memberRegistrationRepoHooks,
                    memberRegistrationOutbox,
                    MemberRegistrationAggregateRepo.logger,
                );
            },
        };
    }
}
