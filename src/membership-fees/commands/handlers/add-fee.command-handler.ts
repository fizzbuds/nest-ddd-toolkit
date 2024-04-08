import { IAggregateRepo, ICommandBus, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { AddFeeCommand } from '../add-fee.command';
import { MembershipFeesAggregate } from '../../domain/membership-fees.aggregate';
import { Inject } from '@nestjs/common';
import { MembershipFeesAggregateRepo } from '../../infrastructure/membership-fees-aggregate.repo';
import { COMMAND_BUS } from '../../../command-bus/command-bus.module';

export class AddFeeCommandHandler implements ICommandHandler<AddFeeCommand> {
    constructor(
        @Inject(MembershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
    ) {
        this.commandBus.register(AddFeeCommand, this);
    }

    async handle({ payload }: AddFeeCommand) {
        const { memberId, amount } = payload;

        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId);
        let feeId: string;

        if (!membershipFeesAggregate) {
            const membershipFeesAggregate = MembershipFeesAggregate.create(memberId);
            feeId = membershipFeesAggregate.addFee(amount);
            await this.aggregateRepo.save(membershipFeesAggregate);
            return { feeId };
        }

        feeId = membershipFeesAggregate.addFee(amount);
        await this.aggregateRepo.save(membershipFeesAggregate);
        return { feeId };
    }
}
