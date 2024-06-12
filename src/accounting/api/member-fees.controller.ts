import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddFeeDto } from './dto/add-fee.dto';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { DeleteFeeCommand } from '../commands/delete-fee.command-handler';
import { GetMembershipFeesQuery } from '../queries/get-member-fees.query-handler';
import { MemberFeesQueryBus } from '../infrastructure/member-fees.query-bus';
import { PayFeeCommand } from '../commands/pay-fee.command-handler';
import { AccountingCommandBus } from '../infrastructure/accounting.command-bus';

@Controller('member-fees')
export class MemberFeesController {
    constructor(
        private readonly accountingCommandBus: AccountingCommandBus,
        private readonly queryBus: MemberFeesQueryBus,
    ) {}

    @Post(':memberId')
    public async addFee(@Param('memberId') memberId: string, @Body() body: AddFeeDto) {
        const { feeId } = await this.accountingCommandBus.sendSync(
            new AddFeeCommand({ memberId, amount: body.amount }),
        );
        return { feeId };
    }

    @Delete(':memberId/:feeId')
    public async deleteFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.accountingCommandBus.sendSync(new DeleteFeeCommand({ memberId, feeId }));
    }

    @Post(':memberId/:feeId/pay')
    public async payFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.accountingCommandBus.sendSync(new PayFeeCommand({ memberId, feeId }));
    }

    @Get('/')
    public async getList() {
        return await this.queryBus.execute(new GetMembershipFeesQuery({}));
    }
}
