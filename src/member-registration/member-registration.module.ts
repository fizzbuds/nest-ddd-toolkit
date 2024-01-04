import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';

import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';
import { MemberRegistrationQueries } from './member-registration.queries';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { MemberRegistrationController } from './api/member-registration.controller';
import { MemberRegistrationCommands } from './member-registration.commands';
import { MemberRegistrationRepoHooks } from './infrastructure/member-registration.repo-hooks';
import { MemberRegistrationOutbox } from './infrastructure/member-registration.outbox';
import { Outbox } from '@fizzbuds/ddd-toolkit';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';

export const memberRegistrationProviders: Provider[] = [
    MemberRegistrationCommands,
    MemberRegistrationQueries,
    MemberRegistrationRepoHooks,
    MemberRegistrationAggregateRepo.providerFactory(),
    MemberRegistrationQueryRepo.providerFactory(),
    MemberRegistrationOutbox.providerFactory(),
];

@Module({
    controllers: [MemberRegistrationController],
    providers: memberRegistrationProviders,
    exports: [MemberRegistrationQueries],
})
export class MemberRegistrationModule implements OnModuleInit {
    constructor(@Inject(MemberRegistrationOutbox) private readonly outbox: Outbox) {}

    async onModuleInit() {
        await this.outbox.startMonitoring();
    }
}
