import { IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import { MemberFeesQueryBus } from '../infrastructure/member-fees.query-bus';
import { Injectable } from '@nestjs/common';
import { FeesQueryModel, FeesQueryRepo } from '../read-models/fees.query-repo';

type GetMembershipFeesQueryPayload = Record<string, never>;

export class GetMembershipFeesQuery extends Query<GetMembershipFeesQueryPayload, FeesQueryModel[]> {
    constructor(payload: GetMembershipFeesQueryPayload) {
        super(payload);
    }
}

@Injectable()
export class GetMemberFeesQueryHandler implements IQueryHandler<GetMembershipFeesQuery> {
    constructor(private readonly membershipFeesQueryRepo: FeesQueryRepo, queryBus: MemberFeesQueryBus) {
        queryBus.register(GetMembershipFeesQuery, this);
    }

    async handle({ payload }: GetMembershipFeesQuery) {
        return await this.membershipFeesQueryRepo.getFees();
    }
}
