import { IRepoHooks } from '../../common';
import { Injectable } from '@nestjs/common';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from './member-fees-query.repo';
import { MemberRegistrationQueries } from '../../member-registration/member-registration.queries';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MembershipFeesAggregate> {
    constructor(
        private readonly memberFeesQueryRepo: MemberFeesQueryRepo,
        private readonly memberRegistrationQueries: MemberRegistrationQueries,
    ) {}

    public async onSave(aggregate: MembershipFeesAggregate) {
        const queryModel = await this.composeQueryModel(aggregate);
        await this.memberFeesQueryRepo.save(queryModel);
    }

    private async composeQueryModel(aggregate: MembershipFeesAggregate): Promise<MemberFeesQueryModel[]> {
        const name = (await this.memberRegistrationQueries.getMemberQuery(aggregate.id))?.name ?? '';

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
