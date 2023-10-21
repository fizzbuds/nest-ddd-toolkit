import { Injectable } from '@nestjs/common';
import { MemberId } from '../member-registration/domain/ids/member-id';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query-repo.service';

@Injectable()
export class MemberFeesQueries {
    constructor(private readonly membershipFeesQueryRepo: MemberFeesQueryRepo) {}

    public async getMemberQuery(memberId: MemberId) {
        return await this.membershipFeesQueryRepo.getFeesByMember(memberId);
    }
}
