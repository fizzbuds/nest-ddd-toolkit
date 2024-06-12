import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesAggregateModel } from './member-fees-aggregate.repo';
import { ClientSession } from 'mongodb';
import { GetMemberQuery } from '../../registration/queries/get-member.query-handler';
import { MemberQueryBus } from '../../registration/infrastructure/member.query-bus';
import { FeesQueryModel, FeesQueryRepo } from './fees-query.repo';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MemberFeesAggregateModel> {
    constructor(private readonly feesQueryRepo: FeesQueryRepo, private readonly memberQueryBus: MemberQueryBus) {}

    public async onSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);
        await this.feesQueryRepo.save(queryModel, session);
    }

    private async composeQueryModel(aggregateModel: MemberFeesAggregateModel): Promise<FeesQueryModel[]> {
        const name =
            (await this.memberQueryBus.execute(new GetMemberQuery({ memberId: aggregateModel.id })))?.name ?? '';

        return aggregateModel.fees.map((fee) => {
            return {
                memberId: aggregateModel.id,
                id: fee.feeId,
                value: fee.value,
                name,
                deleted: fee.deleted,
            };
        });
    }
}
