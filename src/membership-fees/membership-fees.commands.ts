import { MembershipFeesId } from './domain/membership-fees-id';
import { MembershipFeesAggregate } from './domain/membership-fees.aggregate';
import { IAggregateRepo } from '../common';
import { Inject, NotFoundException } from '@nestjs/common';
import { membershipFeesAggregateRepo } from './membership-fees.module';

export class MembershipFeesCommands {
    constructor(
        @Inject(membershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
    ) {}
    public async createCmd() {
        const membershipFeesId = MembershipFeesId.generate();

        const membershipFeesAggregate = MembershipFeesAggregate.create(membershipFeesId);

        await this.aggregateRepo.save(membershipFeesAggregate);
        return membershipFeesId;
    }

    public async addFeeCmd(membershipFeesId: MembershipFeesId, number: number) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(membershipFeesId);
        if (!membershipFeesAggregate) throw new NotFoundException('Membership Fees not found');

        const feeId = membershipFeesAggregate.addFee(number);

        await this.aggregateRepo.save(membershipFeesAggregate);
        return feeId;
    }
}
