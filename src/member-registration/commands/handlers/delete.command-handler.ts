import { IAggregateRepo, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { DeleteMemberCommand } from '../delete-member.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from '../../infrastructure/member-registration-aggregate.repo';
import { MemberRegistrationAggregate } from '../../domain/member-registration.aggregate';
import { MemberDeleted } from '../../events/member-deleted.event';
import { CommandBus } from '../../../command-bus/command-bus.module';
import { EventBus } from '../../../event-bus/event-bus.module';

export class DeleteCommandHandler implements ICommandHandler<DeleteMemberCommand> {
    constructor(
        @Inject(MemberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepo<MemberRegistrationAggregate>,
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
    ) {
        this.commandBus.register(DeleteMemberCommand, this);
    }

    async handle({ payload }: DeleteMemberCommand) {
        const member = await this.aggregateRepo.getById(payload.memberId);
        if (!member) throw new NotFoundException();

        member.delete();
        await this.aggregateRepo.save(member);

        await this.eventBus.publishAndWaitForHandlers(new MemberDeleted({ memberId: member.id }));
    }
}
