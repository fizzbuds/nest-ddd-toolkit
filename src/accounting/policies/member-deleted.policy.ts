import { Injectable } from '@nestjs/common';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { MemberDeleted } from '../../registration/events/member-deleted.event';
import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { AccountingService } from '../accounting.service';

@Injectable()
export class MemberDeletedPolicy implements IEventHandler<MemberDeleted> {
    constructor(private readonly eventBus: EventBus, private readonly service: AccountingService) {
        this.eventBus.subscribe(MemberDeleted, this);
    }

    public async handle(event: MemberDeleted): Promise<void> {
        return await this.service.deleteAllFees({ memberId: event.payload.memberId });
    }
}
