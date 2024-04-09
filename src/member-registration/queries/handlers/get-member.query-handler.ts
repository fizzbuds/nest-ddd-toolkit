import { IQueryBus, IQueryHandler } from '@fizzbuds/ddd-toolkit';
import { GetMemberQuery } from '../get-member.query';
import { MemberRegistrationQueryRepo } from '../../infrastructure/member-registration-query.repo';
import { MEMBER_REGISTRATION_QUERY_BUS } from '../../infrastructure/member-registration.query-bus';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetMemberQueryHandler implements IQueryHandler<GetMemberQuery> {
    constructor(
        private readonly memberRegistrationQueryRepo: MemberRegistrationQueryRepo,
        @Inject(MEMBER_REGISTRATION_QUERY_BUS) queryBus: IQueryBus,
    ) {
        queryBus.register(GetMemberQuery, this);
    }

    async handle({ payload }: GetMemberQuery) {
        const { memberId } = payload;
        return await this.memberRegistrationQueryRepo.getMember(memberId);
    }
}
