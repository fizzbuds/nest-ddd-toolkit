import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from './member-fees-query.repo';
import { MemberRegistrationQueries } from '../../member-registration/member-registration.queries';
import { MembershipFeesAggregateModel } from './membership-fees-aggregate.repo';
import { MemberId } from '../../member-registration/domain/ids/member-id';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MembershipFeesAggregateModel> {
    constructor(
        private readonly memberFeesQueryRepo: MemberFeesQueryRepo,
        private readonly memberRegistrationQueries: MemberRegistrationQueries,
    ) {}

    public async onSave(aggregate: MembershipFeesAggregateModel) {
        const queryModel = await this.composeQueryModel(aggregate);
        await this.memberFeesQueryRepo.save(queryModel);
    }

    private async composeQueryModel(aggregate: MembershipFeesAggregateModel): Promise<MemberFeesQueryModel[]> {
        const name =
            (await this.memberRegistrationQueries.getMemberQuery(MemberId.fromString(aggregate.id)))?.name ?? '';

        return aggregate['fees'].map((fee) => {
            return {
                memberId: aggregate.id.toString(),
                id: fee['feeId'].toString(),
                value: fee['value'],
                name,
            };
        });
    }
}
