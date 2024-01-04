import { Inject, Injectable } from '@nestjs/common';
import { MemberRegistrationQueryModel, MemberRegistrationQueryRepo } from './member-registration-query.repo';
import { IRepoHooks, OutboxPattern } from '@fizzbuds/ddd-toolkit';
import { MemberRegistrationAggregateModel } from './member-registration-aggregate.repo';
import { ClientSession } from 'mongodb';
import { MemberRegistrationOutbox } from './member-registration.outbox';

@Injectable()
export class MemberRegistrationRepoHooks implements IRepoHooks<MemberRegistrationAggregateModel> {
    constructor(
        private readonly queryRepo: MemberRegistrationQueryRepo,
        @Inject(MemberRegistrationOutbox) private readonly outbox: OutboxPattern,
    ) {}

    public async onSave(aggregate: MemberRegistrationAggregateModel, session?: ClientSession) {
        const queryModel = this.composeQueryModel(aggregate);
        await this.queryRepo.save(queryModel, session);

        await this.outbox.scheduleEvent('MemberRegistrationChanged', { ...aggregate });
    }

    private composeQueryModel(aggregate: MemberRegistrationAggregateModel): MemberRegistrationQueryModel {
        return { id: aggregate.id.toString(), name: aggregate['name'] };
    }
}
