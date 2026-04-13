import { Injectable } from '@nestjs/common';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { MemberUnregistered } from '../../registration/events/member-unregistered.event';
import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { AccountingService } from '../accounting.service';

@Injectable()
export class MemberUnregisteredPolicy implements IEventHandler<MemberUnregistered> {
    constructor(private readonly eventBus: EventBus, private readonly service: AccountingService) {
        this.eventBus.subscribe(MemberUnregistered, this);
    }

    public async handle(event: MemberUnregistered): Promise<void> {
        return await this.service.voidAllFees({ memberId: event.payload.memberId });
    }
}
