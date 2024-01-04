import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';

import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';
import { MemberRegistrationQueries } from './member-registration.queries';
import { getConnectionToken } from '@nestjs/mongoose';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationCommands } from './member-registration.commands';
import { MemberRegistrationRepoHooks } from './infrastructure/member-registration.repo-hooks';
import { MemberRegistrationOutbox } from './infrastructure/member-registration.outbox';
import { OutboxPattern } from '../../../ddd-toolkit';

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
        useFactory: MemberRegistrationQueryRepo.providerFactory,
    },
    {
        provide: MemberRegistrationOutbox,
        inject: [getConnectionToken()],
        useFactory: MemberRegistrationOutbox.providerFactory,
    },
];

@Module({
    controllers: [MemberRegistrationController],
    providers: memberRegistrationProviders,
    exports: [MemberRegistrationQueries],
})
export class MemberRegistrationModule implements OnModuleInit {
    constructor(@Inject(MemberRegistrationOutbox) private readonly outbox: OutboxPattern) {}

    async onModuleInit() {
        await this.outbox.sentAllScheduledEvents();
        void this.outbox.startMyScheduledEventsPolling();
    }
}
