import { Injectable } from '@nestjs/common';
import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';

@Injectable()
export class MemberRegistrationQueries {
    constructor(private readonly memberRegistrationQueryRepo: MemberRegistrationQueryRepo) {}

    public async getMemberQuery(memberId: string) {
        return await this.memberRegistrationQueryRepo.getMember(memberId);
    }
}
