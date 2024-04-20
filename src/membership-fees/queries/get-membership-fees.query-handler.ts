import { IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from '../infrastructure/member-fees-query.repo';
import { MembershipFeesQueryBus } from '../infrastructure/membership-fees.query-bus';
import { Injectable } from '@nestjs/common';

type GetMembershipFeesQueryPayload = Record<string, never>;

export class GetMembershipFeesQuery extends Query<GetMembershipFeesQueryPayload, MemberFeesQueryModel[]> {
    constructor(payload: GetMembershipFeesQueryPayload) {
        super(payload);
    }
}

@Injectable()
export class GetMembershipFeesQueryHandler implements IQueryHandler<GetMembershipFeesQuery> {
    constructor(private readonly membershipFeesQueryRepo: MemberFeesQueryRepo, queryBus: MembershipFeesQueryBus) {
        queryBus.register(GetMembershipFeesQuery, this);
    }

    async handle({ payload }: GetMembershipFeesQuery) {
        return await this.membershipFeesQueryRepo.getFees();
    }
}
