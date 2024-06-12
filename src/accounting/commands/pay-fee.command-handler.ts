import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesAggregateRepo } from '../infrastructure/member-fees.aggregate-repo';
import { CommandBus } from '../../command-bus/command-bus.module';

export type PayFeeCommandPayload = { memberId: string; feeId: string };

export class PayFeeCommand extends Command<PayFeeCommandPayload> {
    constructor(public readonly payload: PayFeeCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class PayFeeCommandHandler implements ICommandHandler<PayFeeCommand> {
    constructor(private readonly aggregateRepo: MemberFeesAggregateRepo, private readonly commandBus: CommandBus) {
        this.commandBus.register(PayFeeCommand, this);
    }

    async handle({ payload }: PayFeeCommand) {
        const memberFeesAggregate = await this.aggregateRepo.getById(payload.memberId);
        if (!memberFeesAggregate) throw new Error('Member fees aggregate not found');

        memberFeesAggregate.payFee(payload.feeId);

        await this.aggregateRepo.save(memberFeesAggregate);
    }
}
