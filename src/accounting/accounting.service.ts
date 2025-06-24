import { MemberFeesAggregateRepo } from './@infra/member-fees.aggregate-repo';
import { WithVersion } from '@fizzbuds/ddd-toolkit';
import { MemberFeesAggregate } from './domain/member-fees.aggregate';
import { Injectable } from '@nestjs/common';
import { CreditAmountQueryRepo } from './read-models/credit-amount.query-repo';
import { FeeQueryRepo } from './read-models/fee.query-repo';

@Injectable()
export class AccountingService {
    constructor(
        private readonly aggregateRepo: MemberFeesAggregateRepo,
        private readonly creditAmountQueryRepo: CreditAmountQueryRepo,
        private readonly membershipFeesQueryRepo: FeeQueryRepo,
    ) {}

    async addFee(command: { memberId: string; amount: number }): Promise<{ feeId: string }> {
        const aggregate = await this.getOrCreateAggregate(command.memberId);
        const feeId = aggregate.addFee(command.amount);

        await this.aggregateRepo.save(aggregate);
        return { feeId };
    }

    async deleteAllFees(command: { memberId: string }) {
        // TODO: Implement this command
    }

    async deleteFee(command: { memberId: string; feeId: string }) {
        const aggregate = await this.aggregateRepo.getById(command.memberId);
        if (!aggregate) return;

        aggregate.deleteFee(command.feeId);

        await this.aggregateRepo.save(aggregate);
    }

    async payFee(command: { memberId: string; feeId: string }) {
        const aggregate = await this.aggregateRepo.getById(command.memberId);
        if (!aggregate) return;

        aggregate.payFee(command.feeId);

        await this.aggregateRepo.save(aggregate);
    }

    async getFees() {
        return this.membershipFeesQueryRepo.getFees();
    }

    async getCreditAmounts() {
        return this.creditAmountQueryRepo.getCreditAmounts();
    }

    private async getOrCreateAggregate(memberId: string): Promise<WithVersion<MemberFeesAggregate>> {
        const memberFeeAggregate = await this.aggregateRepo.getById(memberId);
        if (memberFeeAggregate) return memberFeeAggregate;

        await this.aggregateRepo.save(MemberFeesAggregate.create(memberId));
        return this.getOrCreateAggregate(memberId);
    }
}
