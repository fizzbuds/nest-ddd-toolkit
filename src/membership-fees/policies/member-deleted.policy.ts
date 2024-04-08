import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '../../local-event-bus/local-event-bus.module';
import { IEventHandler } from '@fizzbuds/ddd-toolkit/dist/event-bus/event-bus.interface';
import { MemberDeleted } from '../../member-registration/events/member-deleted.event';
import { DeleteAllFeeCommand } from '../commands/delete-all-fee.command';
import { COMMAND_BUS } from '../../command-bus/command-bus.module';
import { ICommandBus } from '@fizzbuds/ddd-toolkit';

@Injectable()
export class MemberDeletedPolicy implements IEventHandler<MemberDeleted> {
    constructor(private readonly eventBus: EventBus, @Inject(COMMAND_BUS) private readonly commandBus: ICommandBus) {
        this.eventBus.subscribe(MemberDeleted, this);
    }

    public async handle(event: MemberDeleted): Promise<void> {
        return this.commandBus.sendSync(new DeleteAllFeeCommand({ memberId: event.payload.memberId }));
    }
}
