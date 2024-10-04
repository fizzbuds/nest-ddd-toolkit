import { IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import { AccountingQueryBus } from '../@infra/accounting.query-bus';
import { Injectable } from '@nestjs/common';
import { FeeQueryModel, FeeQueryRepo } from '../read-models/fee.query-repo';

type GetMembershipFeesQueryPayload = Record<string, never>;

export class GetFeesQuery extends Query<GetMembershipFeesQueryPayload, FeeQueryModel[]> {
    constructor(payload: GetMembershipFeesQueryPayload) {
        super(payload);
    }
}

@Injectable()
export class GetFeesQueryHandler implements IQueryHandler<GetFeesQuery> {
    constructor(private readonly membershipFeesQueryRepo: FeeQueryRepo, queryBus: AccountingQueryBus) {
        queryBus.register(GetFeesQuery, this);
    }

    async handle({ payload }: GetFeesQuery) {
        return await this.membershipFeesQueryRepo.getFees();
    }
}
