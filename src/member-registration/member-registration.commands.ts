import { MemberId } from './domain/ids/member-id';
import { MemberRegistrationAggregate } from './domain/member-registration.aggregate';
import { Inject, NotFoundException } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';
import { IAggregateRepo } from '@fizzbuds/ddd-toolkit';
import { EventBus } from '../local-event-bus/local-event-bus.module';
import { MemberDeleted } from './events/member-deleted.event';

export class MemberRegistrationCommands {
    constructor(
        @Inject(MemberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepo<MemberRegistrationAggregate>,
        private readonly eventBus: EventBus,
    ) {}

    public async createCmd(name: string) {
        const memberId = MemberId.generate();

        const memberRegistrationAggregate = MemberRegistrationAggregate.create(memberId, name);

        await this.aggregateRepo.save(memberRegistrationAggregate);
        return memberId;
    }

    public async deleteCmd(memberId: MemberId) {
        const member = await this.aggregateRepo.getById(memberId.toString());
        if (!member) throw new NotFoundException();

        member.delete();
        await this.aggregateRepo.save(member);

        await this.eventBus.publishAndWaitForHandlers(new MemberDeleted({ memberId: member.id.toString() }));
    }
}
