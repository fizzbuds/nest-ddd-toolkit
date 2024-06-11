import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from './member-fees-query.repo';
import { MemberFeesAggregateModel } from './member-fees-aggregate.repo';
import { ClientSession } from 'mongodb';
import { GetMemberQuery } from '../../registration/queries/get-member.query-handler';
import { MemberQueryBus } from '../../registration/infrastructure/member.query-bus';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MemberFeesAggregateModel> {
    constructor(
        private readonly memberFeesQueryRepo: MemberFeesQueryRepo,
        private readonly memberRegistrationQueryBus: MemberQueryBus,
    ) {}

    public async onSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);
        await this.memberFeesQueryRepo.save(queryModel, session);
    }

    private async composeQueryModel(aggregateModel: MemberFeesAggregateModel): Promise<MemberFeesQueryModel[]> {
        const name =
            (await this.memberRegistrationQueryBus.execute(new GetMemberQuery({ memberId: aggregateModel.id })))
                ?.name ?? '';

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
