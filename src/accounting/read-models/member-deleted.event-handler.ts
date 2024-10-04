import { Injectable } from '@nestjs/common';
import { MemberDeleted } from '../../registration/events/member-deleted.event';
import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { CreditAmountQueryRepo } from './credit-amount.query-repo';

@Injectable()
export class MemberDeletedEventHandler implements IEventHandler<MemberDeleted> {
    constructor(eventBus: EventBus, private readonly creditAmountQueryRepo: CreditAmountQueryRepo) {
        eventBus.subscribe(MemberDeleted, this);
    }

    public async handle({ payload }: MemberDeleted): Promise<void> {
        await this.creditAmountQueryRepo.onMemberDeleted(payload.memberId);
    }
}
