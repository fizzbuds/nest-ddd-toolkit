import { Injectable } from '@nestjs/common';
import { MemberUnregistered } from '../../registration/events/member-unregistered.event';
import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { CreditAmountQueryRepo } from './credit-amount.query-repo';

@Injectable()
export class MemberUnregisteredEventHandler implements IEventHandler<MemberUnregistered> {
    constructor(eventBus: EventBus, private readonly creditAmountQueryRepo: CreditAmountQueryRepo) {
        eventBus.subscribe(MemberUnregistered, this);
    }

    public async handle({ payload }: MemberUnregistered): Promise<void> {
        await this.creditAmountQueryRepo.onMemberUnregistered(payload.memberId);
    }
}
