import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { Injectable } from '@nestjs/common';
import { MemberFeesAggregateModel } from './member-fees.aggregate-repo';
import { ClientSession } from 'mongodb';
import { FeesQueryModel, FeesQueryRepo } from './fees.query-repo';
import { MembersService } from '../../registration/members.service';

@Injectable()
export class MemberFeesRepoHooks implements IRepoHooks<MemberFeesAggregateModel> {
    constructor(private readonly feesQueryRepo: FeesQueryRepo, private readonly membersService: MembersService) {}

    public async onSave(aggregateModel: MemberFeesAggregateModel, session?: ClientSession) {
        const queryModel = await this.composeQueryModel(aggregateModel);
        await this.feesQueryRepo.save(queryModel, session);
    }

    private async composeQueryModel(aggregateModel: MemberFeesAggregateModel): Promise<FeesQueryModel[]> {
        const member = await this.membersService.getMember(aggregateModel.id);
        const name = member?.name ?? '';

        return aggregateModel.fees.map((fee) => {
            return {
                memberId: aggregateModel.id,
                id: fee.feeId,
                value: fee.value,
                name,
                paid: fee.paid,
                deleted: fee.deleted,
            };
        });
    }
}
