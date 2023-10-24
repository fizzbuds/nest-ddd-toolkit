import { Injectable } from '@nestjs/common';
import { MemberFeesQueryRepo } from './infrastructure/member-fees-query.repo';

@Injectable()
export class MemberFeesQueries {
    constructor(private readonly membershipFeesQueryRepo: MemberFeesQueryRepo) {}

    public async getMemberFees() {
        return await this.membershipFeesQueryRepo.getFees();
    }
}
