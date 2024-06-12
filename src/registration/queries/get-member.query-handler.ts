import { IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import { MemberQueryModel, MemberQueryRepo } from '../infrastructure/member.query-repo';
import { Injectable } from '@nestjs/common';
import { MemberQueryBus } from '../infrastructure/member.query-bus';

type GetMemberQueryPayload = { memberId: string };

export class GetMemberQuery extends Query<GetMemberQueryPayload, MemberQueryModel | null> {
    constructor(payload: GetMemberQueryPayload) {
        super(payload);
    }
}

@Injectable()
export class GetMemberQueryHandler implements IQueryHandler<GetMemberQuery> {
    constructor(private readonly memberRegistrationQueryRepo: MemberQueryRepo, memberQueryBus: MemberQueryBus) {
        memberQueryBus.register(GetMemberQuery, this);
    }

    async handle({ payload }: GetMemberQuery) {
        const { memberId } = payload;
        return await this.memberRegistrationQueryRepo.getMember(memberId);
    }
}
