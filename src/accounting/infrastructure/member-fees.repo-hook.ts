import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesAggregateModel } from './member-fees.aggregate-repo';
import { ClientSession } from 'mongodb';
import { FeesQueryRepo } from '../read-models/fees.query-repo';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MemberFeesAggregateModel> {
    constructor(private readonly feesQueryRepo: FeesQueryRepo) {}

    public async onSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        await this.feesQueryRepo.onMemberFeesSave(aggregateModel, session);
    }
}
