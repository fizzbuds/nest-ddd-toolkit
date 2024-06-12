import { Injectable } from '@nestjs/common';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { MemberDeleted } from '../../registration/events/member-deleted.event';
import { CommandBus } from '../../command-bus/command-bus.module';
import { EventBus } from '../../event-bus/event-bus.module';
import { DeleteAllFeeCommand } from '../commands/delete-all-fee.command-handler';

@Injectable()
export class MemberDeletedPolicy implements IEventHandler<MemberDeleted> {
    constructor(private readonly eventBus: EventBus, private readonly commandBus: CommandBus) {
        this.eventBus.subscribe(MemberDeleted, this);
    }

    public async handle(event: MemberDeleted): Promise<void> {
        return await this.commandBus.sendSync(new DeleteAllFeeCommand({ memberId: event.payload.memberId }));
    }
}
