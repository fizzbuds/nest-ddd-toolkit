import { Injectable } from '@nestjs/common';
import { MemberQueryModel, MemberQueryRepo } from './member-query.repo';
import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { MemberAggregateModel } from './member-aggregate.repo';
import { ClientSession } from 'mongodb';

@Injectable()
export class MemberRepoHooks implements IRepoHooks<MemberAggregateModel> {
    constructor(private readonly queryRepo: MemberQueryRepo) {}

    public async onSave(aggregate: MemberAggregateModel, session?: ClientSession) {
        const queryModel = this.composeQueryModel(aggregate);
        await this.queryRepo.save(queryModel, session);
    }

    private composeQueryModel(aggregateModel: MemberAggregateModel): MemberQueryModel {
        return { id: aggregateModel.id, name: aggregateModel.name, deleted: aggregateModel.deleted };
    }
}
