import { Command, ICommandHandler, WithVersion } from '@fizzbuds/ddd-toolkit';
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

    public async handle({ payload }: AddFeeCommand) {
        const memberFeesAggregate = await this.getOrCreateAggregate(payload.memberId);
        const feeId = memberFeesAggregate.addFee(payload.amount);

        await this.aggregateRepo.save(memberFeesAggregate);
        return { feeId };
    }

    private async getOrCreateAggregate(memberId: string): Promise<WithVersion<MemberFeesAggregate>> {
        const memberFeeAggregate = await this.aggregateRepo.getById(memberId);
        if (memberFeeAggregate) return memberFeeAggregate;

        await this.aggregateRepo.save(MemberFeesAggregate.create(memberId));
        return this.getOrCreateAggregate(memberId);
    }
}
