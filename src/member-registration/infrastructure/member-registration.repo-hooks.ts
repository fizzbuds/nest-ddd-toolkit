import { IRepoHooks } from '../../common';
import { Injectable } from '@nestjs/common';
import { MemberRegistrationAggregate } from '../domain/member-registration.aggregate';
import { MemberRegistrationQueryModel, MemberRegistrationQueryRepo } from './member-registration-query.repo';

@Injectable()
export class MemberRegistrationRepoHooks implements IRepoHooks<MemberRegistrationAggregate> {
    constructor(private readonly queryRepo: MemberRegistrationQueryRepo) {}

    public async onSave(aggregate: MemberRegistrationAggregate) {
        const queryModel = this.composeReadModel(aggregate);
        await this.queryRepo.save(queryModel);
    }

    private composeReadModel(aggregate: MemberRegistrationAggregate): MemberRegistrationQueryModel {
        return { id: aggregate.id.toString() };
    }
}
