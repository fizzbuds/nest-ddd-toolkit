import { MembershipFeesAggregate } from './domain/membership-fees.aggregate';
import { IAggregateRepo } from '../common';
import { Inject, NotFoundException } from '@nestjs/common';
import { membershipFeesAggregateRepo } from './membership-fees.module';
import { MemberId } from '../member-registration/domain/ids/member-id';

export class MembershipFeesCommands {
    constructor(
        @Inject(membershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
    ) {}
    public async createCmd(memberId: MemberId) {
        const membershipFeesAggregate = MembershipFeesAggregate.create(memberId);

        await this.aggregateRepo.save(membershipFeesAggregate);
        return memberId;
    }

    public async addFeeCmd(memberId: MemberId, number: number) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId);
        if (!membershipFeesAggregate) throw new NotFoundException('Membership Fees not found');

        const feeId = membershipFeesAggregate.addFee(number);

        await this.aggregateRepo.save(membershipFeesAggregate);
        return feeId;
    }
}
