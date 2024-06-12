import { IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import { AccountingQueryBus } from '../infrastructure/accounting.query-bus';
import { Injectable } from '@nestjs/common';
import { FeesQueryModel, FeesQueryRepo } from '../read-models/fees.query-repo';

type GetMembershipFeesQueryPayload = Record<string, never>;

export class GetFeesQuery extends Query<GetMembershipFeesQueryPayload, FeesQueryModel[]> {
    constructor(payload: GetMembershipFeesQueryPayload) {
        super(payload);
    }
}

@Injectable()
export class GetFeesQueryHandler implements IQueryHandler<GetFeesQuery> {
    constructor(private readonly membershipFeesQueryRepo: FeesQueryRepo, queryBus: AccountingQueryBus) {
        queryBus.register(GetFeesQuery, this);
    }

    async handle({ payload }: GetFeesQuery) {
        return await this.membershipFeesQueryRepo.getFees();
    }
}
