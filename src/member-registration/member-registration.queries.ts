import { Injectable } from '@nestjs/common';
import { MemberRegistrationQueryRepo } from './infrastructure/member-registration-query.repo';
import { MemberId } from './domain/ids/member-id';

@Injectable()
export class MemberRegistrationQueries {
    constructor(private readonly memberRegistrationQueryRepo: MemberRegistrationQueryRepo) {}

    public async getMember(memberId: MemberId) {
        return await this.memberRegistrationQueryRepo.getMember(memberId);
    }
}
