import { IAggregateRepo, ICommandBus, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { DeleteAllFeeCommand } from '../delete-all-fee.command';
import { Inject } from '@nestjs/common';
import { MembershipFeesAggregateRepo } from '../../infrastructure/membership-fees-aggregate.repo';
import { MembershipFeesAggregate } from '../../domain/membership-fees.aggregate';
import { COMMAND_BUS } from '../../../command-bus/command-bus.module';

export class DeleteAllFeeCommandHandler implements ICommandHandler<DeleteAllFeeCommand> {
    constructor(
        @Inject(MembershipFeesAggregateRepo) private readonly aggregateRepo: IAggregateRepo<MembershipFeesAggregate>,
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
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
