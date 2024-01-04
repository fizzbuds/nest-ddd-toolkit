import { MemberId } from './domain/ids/member-id';
import { MemberRegistrationAggregate } from './domain/member-registration.aggregate';
import { Inject } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';
import { IAggregateRepoWithOutbox } from '@fizzbuds/ddd-toolkit';
import { v4 as uuid } from 'uuid';

export class MemberRegistrationCommands {
    constructor(
        @Inject(MemberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepoWithOutbox<MemberRegistrationAggregate>,
    ) {}

    public async createCmd(name: string) {
        const memberId = MemberId.generate();

        const memberRegistrationAggregate = MemberRegistrationAggregate.create(memberId, name);

        const event = {
            id: uuid(),
            payload: { foo: 'bar' },
            routingKey: 'member-registration-created',
        };
        await this.aggregateRepo.save(memberRegistrationAggregate, [event]);
        return memberId;
    }
}
