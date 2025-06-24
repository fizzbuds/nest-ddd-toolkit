import { Injectable } from '@nestjs/common';
import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { CreditAmountQueryRepo } from './credit-amount.query-repo';
import { MemberRenamed } from '../../registration/events/member-renamed.event';

@Injectable()
export class MemberRenamedEventHandler implements IEventHandler<MemberRenamed> {
    constructor(eventBus: EventBus, private readonly creditAmountQueryRepo: CreditAmountQueryRepo) {
        // TODO: Register this handler to the event bus
    }

    public async handle({ payload }: MemberRenamed): Promise<void> {
        //TODO When a member is renamed, we need to rename in the credit amount query repo
    }
}
