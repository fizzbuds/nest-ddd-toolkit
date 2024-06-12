import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { MemberFeesAggregate } from '../domain/member-fees.aggregate';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '../../command-bus/command-bus.module';
import { MemberFeesAggregateRepo } from '../infrastructure/member-fees.aggregate-repo';

type AddFeeCommandPayload = { memberId: string; amount: number };

export class AddFeeCommand extends Command<AddFeeCommandPayload, { feeId: string }> {
    constructor(public readonly payload: AddFeeCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class AddFeeCommandHandler implements ICommandHandler<AddFeeCommand> {
    constructor(private readonly aggregateRepo: MemberFeesAggregateRepo, private readonly commandBus: CommandBus) {
        this.commandBus.register(AddFeeCommand, this);
    }

    async handle({ payload }: AddFeeCommand) {
        const { memberId, amount } = payload;

        const memberFeesAggregate = await this.aggregateRepo.getById(memberId);
        let feeId: string;

        if (!memberFeesAggregate) {
            const memberFeesAggregate = MemberFeesAggregate.create(memberId);
            feeId = memberFeesAggregate.addFee(amount);
            await this.aggregateRepo.save(memberFeesAggregate);
            return { feeId };
        }

        feeId = memberFeesAggregate.addFee(amount);
        await this.aggregateRepo.save(memberFeesAggregate);
        return { feeId };
    }
}
