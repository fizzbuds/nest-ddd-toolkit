import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberFeesAggregateRepo } from '../infrastructure/member-fees.aggregate-repo';
import { AccountingCommandBus } from '../infrastructure/accounting.command-bus';

export type DeleteFeeCommandPayload = { memberId: string; feeId: string };

export class DeleteFeeCommand extends Command<DeleteFeeCommandPayload> {
    constructor(public readonly payload: DeleteFeeCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class DeleteFeeCommandHandler implements ICommandHandler<DeleteFeeCommand> {
    constructor(
        private readonly aggregateRepo: MemberFeesAggregateRepo,
        private readonly accountingCommandBus: AccountingCommandBus,
    ) {
        this.accountingCommandBus.register(DeleteFeeCommand, this);
    }

    async handle({ payload }: DeleteFeeCommand) {
        const memberFeesAggregate = await this.aggregateRepo.getById(payload.memberId);
        if (!memberFeesAggregate) throw new NotFoundException('Member fees aggregate not found');

        memberFeesAggregate.deleteFee(payload.feeId);

        await this.aggregateRepo.save(memberFeesAggregate);
    }
}
