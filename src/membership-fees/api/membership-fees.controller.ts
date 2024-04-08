import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MembershipFeesCommands } from '../membership-fees.commands';
import { MemberFeesQueries } from '../member-fees-queries.service';

@Controller('membership-fees')
export class MembershipFeesController {
    constructor(
        private readonly membershipFeesCommands: MembershipFeesCommands,
        private readonly membershipFeesQueries: MemberFeesQueries,
    ) {}

    @Post(':memberId')
    public async addFee(@Param('memberId') memberId: string, @Body('amount') amount: number) {
        const feeId = await this.membershipFeesCommands.addFeeCmd(memberId, amount);
        return { feeId: feeId.toString() };
    }

    @Delete(':memberId/:feeId')
    public async deleteFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.membershipFeesCommands.deleteFeeCmd(memberId, feeId);
    }

    @Get('/')
    public async getList() {
        return await this.membershipFeesQueries.getMemberFees();
    }
}
