import { Command, IAggregateRepo, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Inject, NotFoundException } from '@nestjs/common';
import { MembershipFeesAggregateRepo } from '../infrastructure/membership-fees-aggregate.repo';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { CommandBus } from '../../command-bus/command-bus.module';

export type DeleteFeeCommandPayload = { memberId: string; feeId: string };

export class DeleteFeeCommand extends Command<DeleteFeeCommandPayload> {
    constructor(public readonly payload: DeleteFeeCommandPayload) {
        super(payload);
    }
}

export class DeleteFeeCommandHandler implements ICommandHandler<DeleteFeeCommand> {
    constructor(
        @Inject(MembershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
        private readonly commandBus: CommandBus,
    ) {
        this.commandBus.register(DeleteFeeCommand, this);
    }

    async handle({ payload }: DeleteFeeCommand) {
        const { memberId, feeId } = payload;

        const membershipFeesAggregate = await this.aggregateRepo.getById(memberId);
        if (!membershipFeesAggregate) throw new NotFoundException();

        membershipFeesAggregate.deleteFee(feeId);

        await this.aggregateRepo.save(membershipFeesAggregate);
    }
}
