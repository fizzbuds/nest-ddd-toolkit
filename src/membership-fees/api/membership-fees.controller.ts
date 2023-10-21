import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MembershipFeesCommands } from '../membership-fees.commands';
import { MemberId } from '../../member-registration/domain/ids/member-id';
import { MemberFeesQueries } from '../member-fees-queries.service';

@Controller('members/:id/fees')
export class MembershipFeesController {
    constructor(
        private readonly membershipFeesCommands: MembershipFeesCommands,
        private readonly membershipFeesQueries: MemberFeesQueries,
    ) {}

    @Post('')
    public async create(@Param('id') memberId: string, @Body('amount') amount: number) {
        const feeId = await this.membershipFeesCommands.addFeeCmd(MemberId.fromString(memberId), amount);
        return { feeId: feeId.toString() };
    }

    @Get('')
    public async get(@Param('id') memberId: string) {
        return { memberFees: await this.membershipFeesQueries.getMemberFees(MemberId.fromString(memberId)) };
    }
}
