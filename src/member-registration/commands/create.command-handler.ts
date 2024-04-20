import { Command, IAggregateRepo, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Inject } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from '../infrastructure/member-registration-aggregate.repo';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { v4 as uuidV4 } from 'uuid';
import { CommandBus } from '../../command-bus/command-bus.module';

type CreateMemberCommandPayload = { name: string };

export class CreateMemberCommand extends Command<CreateMemberCommandPayload, { memberId: string }> {
    constructor(public readonly payload: CreateMemberCommandPayload) {
        super(payload);
    }
}

export class CreateCommandHandler implements ICommandHandler<CreateMemberCommand> {
    constructor(
        @Inject(MemberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepo<MemberRegistrationAggregate>,
        private readonly commandBus: CommandBus,
    ) {
        this.commandBus.register(CreateMemberCommand, this);
    }

    async handle(command: CreateMemberCommand) {
        const memberId = uuidV4();

        const memberRegistrationAggregate = MemberRegistrationAggregate.create(memberId, command.payload.name);

        await this.aggregateRepo.save(memberRegistrationAggregate);
        return { memberId };
    }
}
