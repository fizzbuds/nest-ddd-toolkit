import { IRepoHooks } from '../../common';
import { Injectable } from '@nestjs/common';
import { MembershipFeesAggregate } from '../domain/membership-fees.aggregate';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from './member-fees-query-repo.service';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MembershipFeesAggregate> {
    constructor(private readonly queryRepo: MemberFeesQueryRepo) {}

    public async onSave(aggregate: MembershipFeesAggregate) {
        const queryModel = this.composeQueryModel(aggregate);
        await this.queryRepo.save(queryModel);
    }

    private composeQueryModel(aggregate: MembershipFeesAggregate): MemberFeesQueryModel[] {
        return aggregate['fees'].map((fee) => {
            return {
                memberId: aggregate.id.toString(),
                id: fee['feeId'].toString(),
                value: fee['value'],
                name: '',
            };
        });
    }
}
