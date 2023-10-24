import { MemberId } from './domain/ids/member-id';
import { MemberRegistrationAggregate } from './domain/member-registration.aggregate';
import { IAggregateRepo } from '../common';
import { Inject } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from './infrastructure/member-registration-aggregate.repo';

export class MemberRegistrationCommands {
    constructor(
        @Inject(MemberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepo<MemberRegistrationAggregate>,
    ) {}
    public async createCmd(name: string) {
        const memberId = MemberId.generate();

        const memberRegistrationAggregate = MemberRegistrationAggregate.create(memberId, name);

        await this.aggregateRepo.save(memberRegistrationAggregate);
        return memberId;
    }
}
