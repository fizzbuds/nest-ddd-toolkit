import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesAggregateRepo } from '../infrastructure/member-fees.aggregate-repo';
import { AccountingCommandBus } from '../infrastructure/accounting.command-bus';

type DeleteAllFeeCommandPayload = { memberId: string };

export class DeleteAllFeeCommand extends Command<DeleteAllFeeCommandPayload> {
    constructor(public readonly payload: DeleteAllFeeCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class DeleteAllFeeCommandHandler implements ICommandHandler<DeleteAllFeeCommand> {
    constructor(
        private readonly aggregateRepo: MemberFeesAggregateRepo,
        private readonly accountingCommandBus: AccountingCommandBus,
    ) {
        this.accountingCommandBus.register(DeleteAllFeeCommand, this);
    }

    async handle({ payload }: DeleteAllFeeCommand) {}
}
