import { IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import {
    MemberRegistrationQueryModel,
    MemberRegistrationQueryRepo,
} from '../infrastructure/member-registration-query.repo';
import { Injectable } from '@nestjs/common';
import { MemberRegistrationQueryBus } from '../infrastructure/member-registration.query-bus';

type GetMemberQueryPayload = { memberId: string };

export class GetMemberQuery extends Query<GetMemberQueryPayload, MemberRegistrationQueryModel | null> {
    constructor(payload: GetMemberQueryPayload) {
        super(payload);
    }
}

@Injectable()
export class GetMemberQueryHandler implements IQueryHandler<GetMemberQuery> {
    constructor(
        private readonly memberRegistrationQueryRepo: MemberRegistrationQueryRepo,
        memberRegistrationQueryBus: MemberRegistrationQueryBus,
    ) {
        memberRegistrationQueryBus.register(GetMemberQuery, this);
    }

    async handle({ payload }: GetMemberQuery) {
        const { memberId } = payload;
        return await this.memberRegistrationQueryRepo.getMember(memberId);
    }
}
