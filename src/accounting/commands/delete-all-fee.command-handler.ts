import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesAggregateRepo } from '../infrastructure/member-fees.aggregate-repo';
import { CommandBus } from '../../command-bus/command-bus.module';

type DeleteAllFeeCommandPayload = { memberId: string };

export class DeleteAllFeeCommand extends Command<DeleteAllFeeCommandPayload> {
    constructor(public readonly payload: DeleteAllFeeCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class DeleteAllFeeCommandHandler implements ICommandHandler<DeleteAllFeeCommand> {
    constructor(private readonly aggregateRepo: MemberFeesAggregateRepo, private readonly commandBus: CommandBus) {
        this.commandBus.register(DeleteAllFeeCommand, this);
    }

    async handle({ payload }: DeleteAllFeeCommand) {
        const { memberId } = payload;

        const memberFeesAggregate = await this.aggregateRepo.getById(memberId);
        if (!memberFeesAggregate) return;

        memberFeesAggregate.deleteAllFees();

        await this.aggregateRepo.save(memberFeesAggregate);
    }
}
