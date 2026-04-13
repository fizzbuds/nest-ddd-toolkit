import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { IssueFeeDto } from './dto/issue-fee.dto';
import { AccountingService } from '../accounting.service';

@Controller('accounting/members/:memberId/fees')
export class MemberFeesController {
    constructor(private readonly service: AccountingService) {}

    @Post('')
    public async issueFee(@Param('memberId') memberId: string, @Body() body: IssueFeeDto) {
        return await this.service.issueFee({ memberId, amount: body.amount });
    }

    @Delete(':feeId')
    public async voidFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.service.voidFee({ memberId, feeId });
    }

    @Post(':feeId/pay')
    @HttpCode(HttpStatus.ACCEPTED)
    public async payFee(@Param('memberId') memberId: string, @Param('feeId') feeId: string) {
        await this.service.payFee({ memberId, feeId });
    }
}
