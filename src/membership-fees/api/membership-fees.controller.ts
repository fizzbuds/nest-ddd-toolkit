import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MembershipFeesCommands } from '../membership-fees.commands';
import { MemberId } from '../../member-registration/domain/ids/member-id';
import { MemberFeesQueries } from '../member-fees-queries.service';
import { FeeId } from '../domain/ids/fee-id';

@Controller('membership-fees')
export class MembershipFeesController {
    constructor(
        private readonly membershipFeesCommands: MembershipFeesCommands,
        private readonly membershipFeesQueries: MemberFeesQueries,
    ) {}

    @Post(':memberId')
    public async addFee(@Param('memberId') memberId: string, @Body('amount') amount: number) {
        const feeId = await this.membershipFeesCommands.addFeeCmd(MemberId.fromString(memberId), amount);
        return { feeId: feeId.toString() };
    }

    @Delete(':memberId/:feeId')
    public async deleteFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.membershipFeesCommands.deleteFeeCmd(MemberId.fromString(memberId), FeeId.fromString(feeId));
    }

    @Get('/')
    public async getList() {
        return await this.membershipFeesQueries.getMemberFees();
    }
}
