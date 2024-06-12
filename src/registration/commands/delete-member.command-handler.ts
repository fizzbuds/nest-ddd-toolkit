import { Command, ICommandHandler } from '@fizzbuds/ddd-toolkit';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberAggregateRepo } from '../infrastructure/member.aggregate-repo';
import { MemberDeleted } from '../events/member-deleted.event';
import { CommandBus } from '../../command-bus/command-bus.module';
import { EventBus } from '../../event-bus/event-bus.module';

type DeleteMemberCommandPayload = { memberId: string };

export class DeleteMemberCommand extends Command<DeleteMemberCommandPayload> {
    constructor(public readonly payload: DeleteMemberCommandPayload) {
        super(payload);
    }
}

@Injectable()
export class DeleteMemberCommandHandler implements ICommandHandler<DeleteMemberCommand> {
    constructor(
        private readonly aggregateRepo: MemberAggregateRepo,
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
