import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AddFeeDto } from './dto/add-fee.dto';
import { AccountingService } from '../accounting.service';

@Controller('accounting/members/:memberId/fees')
export class MemberFeesController {
    constructor(private readonly service: AccountingService) {}

    @Post('')
    public async addFee(@Param('memberId') memberId: string, @Body() body: AddFeeDto) {
        return await this.service.addFee({ memberId, amount: body.amount });
    }

    @Delete(':feeId')
    public async deleteFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.service.deleteFee({ memberId, feeId });
    }

    @Post(':feeId/pay')
    @HttpCode(HttpStatus.ACCEPTED)
    public async payFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.service.payFee({ memberId, feeId });
    }
}
