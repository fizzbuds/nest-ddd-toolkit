import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from './member-fees-query.repo';
import { MembershipFeesAggregateModel } from './membership-fees-aggregate.repo';
import { ClientSession } from 'mongodb';
import { GetMemberQuery } from '../../member-registration/queries/get-member.query-handler';
import { MemberRegistrationQueryBus } from '../../member-registration/infrastructure/member-registration.query-bus';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MembershipFeesAggregateModel> {
    constructor(
        private readonly memberFeesQueryRepo: MemberFeesQueryRepo,
        private readonly memberRegistrationQueryBus: MemberRegistrationQueryBus,
    ) {}

    public async onSave(aggregateModel: MembershipFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);
        await this.memberFeesQueryRepo.save(queryModel, session);
    }

    private async composeQueryModel(aggregateModel: MembershipFeesAggregateModel): Promise<MemberFeesQueryModel[]> {
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
