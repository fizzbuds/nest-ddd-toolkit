import { Command, IAggregateRepo, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Inject } from '@nestjs/common';
import { MembershipFeesAggregateRepo } from '../infrastructure/membership-fees-aggregate.repo';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { CommandBus } from '../../command-bus/command-bus.module';

type DeleteAllFeeCommandPayload = { memberId: string };

export class DeleteAllFeeCommand extends Command<DeleteAllFeeCommandPayload> {
    constructor(public readonly payload: DeleteAllFeeCommandPayload) {
        super(payload);
    }
}

export class DeleteAllFeeCommandHandler implements ICommandHandler<DeleteAllFeeCommand> {
    constructor(
        @Inject(MembershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
        private readonly commandBus: CommandBus,
    ) {
        this.commandBus.register(DeleteAllFeeCommand, this);
    }

    async handle({ payload }: DeleteAllFeeCommand) {
        const { memberId } = payload;

        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId);
        if (!membershipFeesAggregate) return;

        membershipFeesAggregate.deleteAllFees();

        await this.aggregateRepo.save(membershipFeesAggregate);
    }
}
