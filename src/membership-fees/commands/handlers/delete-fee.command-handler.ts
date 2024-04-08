import { IAggregateRepo, ICommandBus, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { DeleteFeeCommand } from '../delete-fee.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { MembershipFeesAggregateRepo } from '../../infrastructure/membership-fees-aggregate.repo';
import { MembershipFeesAggregate } from '../../domain/membership-fees.aggregate';
import { COMMAND_BUS } from '../../../command-bus/command-bus.module';

export class DeleteFeeCommandHandler implements ICommandHandler<DeleteFeeCommand> {
    constructor(
        @Inject(MembershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
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
