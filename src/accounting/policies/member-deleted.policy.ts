import { Injectable } from '@nestjs/common';
import { IEventHandler } from '@fizzbuds/ddd-toolkit';
import { MemberDeleted } from '../../registration/events/member-deleted.event';
import { EventBus } from '../../@infra/event-bus/event-bus.module';
import { DeleteAllFeeCommand } from '../commands/delete-all-fee.command-handler';
import { AccountingCommandBus } from '../@infra/accounting.command-bus';

@Injectable()
export class MemberDeletedPolicy implements IEventHandler<MemberDeleted> {
    constructor(private readonly eventBus: EventBus, private readonly accountingCommandBus: AccountingCommandBus) {
        this.eventBus.subscribe(MemberDeleted, this);
    }

    public async handle(event: MemberDeleted): Promise<void> {
        return await this.accountingCommandBus.sendSync(new DeleteAllFeeCommand({ memberId: event.payload.memberId }));
    }
}
