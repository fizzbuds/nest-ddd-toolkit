import { Injectable } from '@nestjs/common';
import { CreditAmountQueryRepo } from './read-models/credit-amount.query-repo';

@Injectable()
export class AccountingHooks {
    constructor(private readonly creditAmountQueryRepo: CreditAmountQueryRepo) {}

    async onMemberRegistered(event: { memberId: string; memberName: string }) {
        await this.creditAmountQueryRepo.onMemberRegistered({
            memberId: event.memberId,
            memberName: event.memberName,
        });
    }

    async onMemberRenamed(event: { memberId: string; memberName: string }) {
        await this.creditAmountQueryRepo.onMemberRenamed({
            memberId: event.memberId,
            memberName: event.memberName,
        });
    }

    async onMemberDeleted(event: { memberId: string }) {
        await this.creditAmountQueryRepo.onMemberDeleted(event.memberId);
    }
}
