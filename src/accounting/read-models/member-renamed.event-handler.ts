import { Injectable } from '@nestjs/common';
import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { CreditAmountQueryRepo } from './credit-amount.query-repo';
import { MemberRenamed } from '../../registration/events/member-renamed.event';

@Injectable()
export class MemberRenamedEventHandler implements IEventHandler<MemberRenamed> {
    constructor(eventBus: EventBus, private readonly creditAmountQueryRepo: CreditAmountQueryRepo) {
        eventBus.subscribe(MemberRenamed, this);
    }

    public async handle({ payload }: MemberRenamed): Promise<void> {
        await this.creditAmountQueryRepo.onMemberRenamed({
            memberId: payload.memberId,
            memberName: payload.memberName,
        });
    }
}
