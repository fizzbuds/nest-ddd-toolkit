import { Injectable } from '@nestjs/common';
import { MemberRegistrationQueryModel, MemberRegistrationQueryRepo } from './member-registration-query.repo';
import { IRepoHooks } from '@fizzbuds/ddd-toolkit';
import { MemberRegistrationAggregateModel } from './member-registration-aggregate.repo';

@Injectable()
export class MemberRegistrationRepoHooks implements IRepoHooks<MemberRegistrationAggregateModel> {
    constructor(private readonly queryRepo: MemberRegistrationQueryRepo) {}

    public async onSave(aggregate: MemberRegistrationAggregateModel) {
        const queryModel = this.composeQueryModel(aggregate);
        await this.queryRepo.save(queryModel);
    }

    private composeQueryModel(aggregate: MemberRegistrationAggregateModel): MemberRegistrationQueryModel {
        return { id: aggregate.id.toString(), name: aggregate['name'] };
    }
}
