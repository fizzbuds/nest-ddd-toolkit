import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { AddFeeDto } from './dto/add-fee.dto';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { DeleteFeeCommand } from '../commands/delete-fee.command-handler';
import { PayFeeCommand } from '../commands/pay-fee.command-handler';
import { AccountingCommandBus } from '../infrastructure/accounting.command-bus';

@Controller('accounting/members')
export class MemberFeesController {
    constructor(private readonly accountingCommandBus: AccountingCommandBus) {}

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
}
