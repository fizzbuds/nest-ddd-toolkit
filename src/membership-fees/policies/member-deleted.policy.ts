import { Injectable } from '@nestjs/common';
import { EventBus } from '../../local-event-bus/local-event-bus.module';
import { IEventHandler } from '@fizzbuds/ddd-toolkit/dist/event-bus/event-bus.interface';
import { MembershipFeesCommands } from '../membership-fees.commands';
import { MemberDeleted } from '../../member-registration/events/member-deleted.event';

@Injectable()
export class MemberDeletedPolicy implements IEventHandler<MemberDeleted> {
    constructor(private readonly eventBus: EventBus, private readonly membershipFeesCommands: MembershipFeesCommands) {
        this.eventBus.subscribe(MemberDeleted, this);
    }

    public async handle(event: MemberDeleted): Promise<void> {
        return this.membershipFeesCommands.deleteAllFeesCmd(event.payload.memberId);
    }
}
