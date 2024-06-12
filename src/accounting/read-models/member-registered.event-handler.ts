import { Injectable } from '@nestjs/common';
import { EventBus } from '../../event-bus/event-bus.module';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { MemberRegistered } from '../../registration/events/member-registered.event';
import { CreditAmountQueryRepo } from './credit-amount.query-repo';

@Injectable()
export class MemberRegisteredEventHandler implements IEventHandler<MemberRegistered> {
    constructor(eventBus: EventBus, private readonly creditAmountQueryRepo: CreditAmountQueryRepo) {
        eventBus.subscribe(MemberRegistered, this);
    }

    public async handle({ payload }: MemberRegistered): Promise<void> {
        await this.creditAmountQueryRepo.save({
            memberName: payload.memberName,
            creditAmount: 0,
            deleted: false,
            memberId: payload.memberId,
        });
    }
}
