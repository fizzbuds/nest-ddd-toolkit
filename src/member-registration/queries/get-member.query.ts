import { Query } from '@fizzbuds/ddd-toolkit';
import { MemberRegistrationQueryModel } from '../infrastructure/member-registration-query.repo';

type GetMemberQueryPayload = { memberId: string };

export class GetMemberQuery extends Query<GetMemberQueryPayload, MemberRegistrationQueryModel | null> {
    constructor(payload: GetMemberQueryPayload) {
        super(payload);
    }
}
