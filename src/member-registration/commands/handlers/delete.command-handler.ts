import { IAggregateRepo, ICommandBus, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { DeleteMemberCommand } from '../delete-member.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { MemberRegistrationAggregateRepo } from '../../infrastructure/member-registration-aggregate.repo';
import { MemberRegistrationAggregate } from '../../domain/member-registration.aggregate';
import { EventBus } from '../../../local-event-bus/local-event-bus.module';
import { MemberDeleted } from '../../events/member-deleted.event';
import { COMMAND_BUS } from '../../../command-bus/command-bus.module';

export class DeleteCommandHandler implements ICommandHandler<DeleteMemberCommand> {
    constructor(
        @Inject(MemberRegistrationAggregateRepo)
        private readonly aggregateRepo: IAggregateRepo<MemberRegistrationAggregate>,
        private readonly eventBus: EventBus,
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
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
