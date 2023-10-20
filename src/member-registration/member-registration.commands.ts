import { MemberId } from './domain/ids/member-id';
import { MemberRegistrationAggregate } from './domain/member-registration.aggregate';
import { IAggregateRepo } from '../common';
import { Inject } from '@nestjs/common';
import { memberRegistrationAggregateRepo } from './member-registration.module';

export class MemberRegistrationCommands {
    constructor(
        @Inject(memberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepo<MemberRegistrationAggregate>,
    ) {}
    public async createCmd() {
        const memberId = MemberId.generate();

        const memberRegistrationAggregate = MemberRegistrationAggregate.create(memberId);

        await this.aggregateRepo.save(memberRegistrationAggregate);
        return memberId;
    }
}
