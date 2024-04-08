import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from './member-fees-query.repo';
import { MemberRegistrationQueries } from '../../member-registration/member-registration.queries';
import { MembershipFeesAggregateModel } from './membership-fees-aggregate.repo';
import { ClientSession } from 'mongodb';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MembershipFeesAggregateModel> {
    constructor(
        private readonly memberFeesQueryRepo: MemberFeesQueryRepo,
        private readonly memberRegistrationQueries: MemberRegistrationQueries,
    ) {}

    public async onSave(aggregateModel: MembershipFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);
        await this.memberFeesQueryRepo.save(queryModel, session);
    }

    private async composeQueryModel(aggregateModel: MembershipFeesAggregateModel): Promise<MemberFeesQueryModel[]> {
        const name = (await this.memberRegistrationQueries.getMemberQuery(aggregateModel.id))?.name ?? '';

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
