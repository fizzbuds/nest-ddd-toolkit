import { FeesId } from './domain/fees-id';
import { MembershipFeesAggregate } from './domain/membership-fees.aggregate';
import { IAggregateRepo } from '../common';
import { Inject } from '@nestjs/common';
import { membershipFeesAggregateRepo } from './membership-fees.module';

export class MembershipFeesCommands {
    constructor(
        @Inject(membershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
    ) {}
    public async createCmd() {
        const membershipFeesId = FeesId.generate();
        const membershipFeeAggregate = MembershipFeesAggregate.create(membershipFeesId);
        await this.aggregateRepo.save(membershipFeeAggregate);
        return membershipFeesId;
    }
}
