import { IAggregateRepo, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { CreateMemberCommand } from '../create-member.command';
import { Inject } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from '../../infrastructure/member-registration-aggregate.repo';
import { MemberRegistrationAggregate } from '../../domain/member-registration.aggregate';
import { v4 as uuidV4 } from 'uuid';
import { CommandBus } from '../../../command-bus/command-bus.module';

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
