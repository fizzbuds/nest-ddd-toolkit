import { Injectable } from '@nestjs/common';
import { MemberRegistrationQueryModel, MemberRegistrationQueryRepo } from './member-registration-query.repo';
import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { MemberRegistrationAggregateModel } from './member-registration-aggregate.repo';
import { ClientSession } from 'mongodb';

@Injectable()
export class MemberRegistrationRepoHooks implements IRepoHooks<MemberRegistrationAggregateModel> {
    constructor(private readonly queryRepo: MemberRegistrationQueryRepo) {}

    public async onSave(aggregate: MemberRegistrationAggregateModel, session?: ClientSession) {
        const queryModel = this.composeQueryModel(aggregate);
        await this.queryRepo.save(queryModel, session);
    }

    private composeQueryModel(aggregateModel: MemberRegistrationAggregateModel): MemberRegistrationQueryModel {
        return { id: aggregateModel.id, name: aggregateModel.name, deleted: aggregateModel.deleted };
    }
}
