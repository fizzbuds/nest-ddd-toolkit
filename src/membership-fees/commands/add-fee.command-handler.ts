import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '../../command-bus/command-bus.module';
import { MembershipFeesAggregateRepo } from '../infrastructure/membership-fees-aggregate.repo';

type AddFeeCommandPayload = { memberId: string; amount: number };

export class AddFeeCommand extends Command<AddFeeCommandPayload, { feeId: string }> {
    constructor(public readonly payload: AddFeeCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class AddFeeCommandHandler implements ICommandHandler<AddFeeCommand> {
    constructor(private readonly aggregateRepo: MembershipFeesAggregateRepo, private readonly commandBus: CommandBus) {
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
