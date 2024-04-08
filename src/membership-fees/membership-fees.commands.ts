import { MembershipFeesAggregate } from './domain/membership-fees.aggregate';
import { Inject, NotFoundException } from '@nestjs/common';
import { MembershipFeesAggregateRepo } from './infrastructure/membership-fees-aggregate.repo';
import { IAggregateRepo } from '@fizzbuds/ddd-toolkit';

export class MembershipFeesCommands {
    constructor(
        @Inject(MembershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
    ) {}

    public async addFeeCmd(memberId: string, number: number) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId.toString());
        let feeId: string;

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

    public async deleteFeeCmd(memberId: string, feeId: string) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId);
        if (!membershipFeesAggregate) throw new NotFoundException();

        membershipFeesAggregate.deleteFee(feeId);

        await this.aggregateRepo.save(membershipFeesAggregate);
    }

    public async deleteAllFeesCmd(memberId: string) {
        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId);
        if (!membershipFeesAggregate) return;

        membershipFeesAggregate.deleteAllFees();

        await this.aggregateRepo.save(membershipFeesAggregate);
    }
}
