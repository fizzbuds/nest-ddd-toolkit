import { MemberRegistrationAggregate } from './domain/member-registration.aggregate';
import { Inject, NotFoundException } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';
import { IAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { EventBus } from '../local-event-bus/local-event-bus.module';
import { MemberDeleted } from './events/member-deleted.event';
import { v4 as uuidV4 } from 'uuid';

export class MemberRegistrationCommands {
    constructor(
        @Inject(MemberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepo<MemberRegistrationAggregate>,
        private readonly eventBus: EventBus,
    ) {}

    public async createCmd(name: string) {
        const memberId = uuidV4();

        const memberRegistrationAggregate = MemberRegistrationAggregate.create(memberId, name);

        await this.aggregateRepo.save(memberRegistrationAggregate);
        return memberId;
    }

    public async deleteCmd(memberId: string) {
        const member = await this.aggregateRepo.getById(memberId.toString());
        if (!member) throw new NotFoundException();

        member.delete();
        await this.aggregateRepo.save(member);

        await this.eventBus.publishAndWaitForHandlers(new MemberDeleted({ memberId: member.id.toString() }));
    }
}
