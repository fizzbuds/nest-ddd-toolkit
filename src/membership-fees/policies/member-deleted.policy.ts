import { Inject, Injectable } from '@nestjs/common';
import { ICommandBus, IEventBus, IEventHandler } from '@fizzbuds/ddd-toolkit';
import { MemberDeleted } from '../../member-registration/events/member-deleted.event';
import { DeleteAllFeeCommand } from '../commands/delete-all-fee.command';
import { COMMAND_BUS } from '../../command-bus/command-bus.module';
import { EVENT_BUS } from '../../event-bus/event-bus.module';

@Injectable()
export class MemberDeletedPolicy implements IEventHandler<MemberDeleted> {
    constructor(
        @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
        @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus,
    ) {
        this.eventBus.subscribe(MemberDeleted, this);
    }

    public async handle(event: MemberDeleted): Promise<void> {
        return this.commandBus.sendSync(new DeleteAllFeeCommand({ memberId: event.payload.memberId }));
    }
}
