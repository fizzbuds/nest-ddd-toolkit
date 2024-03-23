import { MembershipFeesAggregate } from './domain/membership-fees.aggregate';
import { Inject, NotFoundException } from '@nestjs/common';
import { MemberId } from '../member-registration/domain/ids/member-id';
import { FeeId } from './domain/ids/fee-id';
import { MembershipFeesAggregateRepo } from './infrastructure/membership-fees-aggregate.repo';
import { IAggregateRepo } from '@fizzbuds/ddd-toolkit';

export class MembershipFeesCommands {
    constructor(
        @Inject(MembershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
    ) {}

    public async addFeeCmd(memberId: MemberId, number: number) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId.toString());
        let feeId: FeeId;

        if (!membershipFeesAggregate) {
            const membershipFeesAggregate = MembershipFeesAggregate.create(memberId);
            feeId = membershipFeesAggregate.addFee(number);
            await this.aggregateRepo.save(membershipFeesAggregate);
            return feeId;
        }

        feeId = membershipFeesAggregate.addFee(number);
        await this.aggregateRepo.save(membershipFeesAggregate);
        return feeId;
    }

    public async deleteFeeCmd(memberId: MemberId, feeId: FeeId) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId.toString());
        if (!membershipFeesAggregate) throw new NotFoundException();

        membershipFeesAggregate.deleteFee(feeId);

        await this.aggregateRepo.save(membershipFeesAggregate);
    }

    public async deleteAllFeesCmd(memberId: MemberId) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId.toString());
        if (!membershipFeesAggregate) return;

        membershipFeesAggregate.deleteAllFees();

        await this.aggregateRepo.save(membershipFeesAggregate);
    }
}
