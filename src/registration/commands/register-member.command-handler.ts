import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { MemberAggregateRepo } from '../infrastructure/member-aggregate.repo';
import { MemberAggregate } from '../domain/member.aggregate';
import { v4 as uuidV4 } from 'uuid';
import { CommandBus } from '../../command-bus/command-bus.module';
import { Injectable } from '@nestjs/common';

export class RegisterMemberCommand extends Command<{ name: string }, { memberId: string }> {
    constructor(public readonly payload: { name: string }) {
        super(payload);
    }
}

@Injectable()
export class RegisterMemberCommandHandler implements ICommandHandler<RegisterMemberCommand> {
    constructor(private readonly aggregateRepo: MemberAggregateRepo, private readonly commandBus: CommandBus) {
        this.commandBus.register(RegisterMemberCommand, this);
    }

    async handle(command: RegisterMemberCommand) {
        const memberId = uuidV4();

        const memberAggregate = MemberAggregate.create(memberId, command.payload.name);

        await this.aggregateRepo.save(memberAggregate);
        return { memberId };
    }
}
