import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AddFeeDto } from './dto/add-fee.dto';
import { AddFeeCommand } from '../commands/add-fee.command-handler';
import { DeleteFeeCommand } from '../commands/delete-fee.command-handler';
import { PayFeeCommand } from '../commands/pay-fee.command-handler';
import { AccountingCommandBus } from '../@infra/accounting.command-bus';

@Controller('accounting/members/:memberId/fees')
export class MemberFeesController {
    constructor(private readonly accountingCommandBus: AccountingCommandBus) {}

    @Post('')
    public async addFee(@Param('memberId') memberId: string, @Body() body: AddFeeDto) {
        const { feeId } = await this.accountingCommandBus.sendSync(
            new AddFeeCommand({ memberId, amount: body.amount }),
        );
        return { feeId };
    }

    @Delete(':feeId')
    public async deleteFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.accountingCommandBus.sendSync(new DeleteFeeCommand({ memberId, feeId }));
    }

    @Post(':feeId/pay')
    @HttpCode(HttpStatus.ACCEPTED)
    public async payFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.accountingCommandBus.sendSync(new PayFeeCommand({ memberId, feeId }));
    }
}
