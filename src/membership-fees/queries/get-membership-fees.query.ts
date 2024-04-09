import { Query } from '@fizzbuds/ddd-toolkit';
import { MemberFeesQueryModel } from '../infrastructure/member-fees-query.repo';

type GetMembershipFeesQueryPayload = Record<string, never>;

export class GetMembershipFeesQuery extends Query<GetMembershipFeesQueryPayload, MemberFeesQueryModel[]> {
    constructor(payload: GetMembershipFeesQueryPayload) {
        super(payload);
    }
}
