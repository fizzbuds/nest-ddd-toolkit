import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesAggregateModel } from './member-fees.aggregate-repo';
import { ClientSession } from 'mongodb';
import { FeeQueryRepo } from '../read-models/fee.query-repo';
import { CreditAmountQueryRepo } from '../read-models/credit-amount.query-repo';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MemberFeesAggregateModel> {
    constructor(private readonly feeQueryRepo: FeeQueryRepo, creditAmountQueryRepo: CreditAmountQueryRepo) {}

    public async onSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        await this.feeQueryRepo.onMemberFeesSave(aggregateModel, session);
    }
}
