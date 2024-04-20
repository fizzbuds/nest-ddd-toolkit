import { IQueryBus, IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import { MemberFeesQueryModel, MemberFeesQueryRepo } from '../infrastructure/member-fees-query.repo';
import { Inject } from '@nestjs/common';
import { MEMBERSHIP_FEES_QUERY_BUS } from '../infrastructure/membership-fees.query-bus';

type GetMembershipFeesQueryPayload = Record<string, never>;

export class GetMembershipFeesQuery extends Query<GetMembershipFeesQueryPayload, MemberFeesQueryModel[]> {
    constructor(payload: GetMembershipFeesQueryPayload) {
        super(payload);
    }
}

export class GetMembershipFeesQueryHandler implements IQueryHandler<GetMembershipFeesQuery> {
    constructor(
        private readonly membershipFeesQueryRepo: MemberFeesQueryRepo,
        @Inject(MEMBERSHIP_FEES_QUERY_BUS) queryBus: IQueryBus,
    ) {
        queryBus.register(GetMembershipFeesQuery, this);
    }

    async handle({ payload }: GetMembershipFeesQuery) {
        return await this.membershipFeesQueryRepo.getFees();
    }
}
