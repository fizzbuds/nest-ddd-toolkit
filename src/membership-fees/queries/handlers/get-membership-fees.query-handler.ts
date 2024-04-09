import { IQueryBus, IQueryHandler } from '@fizzbuds/ddd-toolkit';
import { GetMembershipFeesQuery } from '../get-membership-fees.query';
import { MemberFeesQueryRepo } from '../../infrastructure/member-fees-query.repo';
import { Inject } from '@nestjs/common';
import { MEMBERSHIP_FEES_QUERY_BUS } from '../../infrastructure/membership-fees.query-bus';

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
