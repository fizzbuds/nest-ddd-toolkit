import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberFeesAggregateRepo } from '../@infra/member-fees.aggregate-repo';
import { AccountingCommandBus } from '../@infra/accounting.command-bus';

export type PayFeeCommandPayload = { memberId: string; feeId: string };

export class PayFeeCommand extends Command<PayFeeCommandPayload> {
    constructor(public readonly payload: PayFeeCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class PayFeeCommandHandler implements ICommandHandler<PayFeeCommand> {
    constructor(
        private readonly aggregateRepo: MemberFeesAggregateRepo,
        private readonly accountingCommandBus: AccountingCommandBus,
    ) {
        this.accountingCommandBus.register(PayFeeCommand, this);
    }

    async handle({ payload }: PayFeeCommand) {
        const memberFeesAggregate = await this.aggregateRepo.getById(payload.memberId);
        if (!memberFeesAggregate) throw new NotFoundException('Member fees aggregate not found');

        memberFeesAggregate.payFee(payload.feeId);

        await this.aggregateRepo.save(memberFeesAggregate);
    }
}
