import { Controller, Get } from '@nestjs/common';
import { AccountingService } from '../accounting.service';

@Controller('accounting/credit-amounts')
export class CreditAmountController {
    constructor(private readonly service: AccountingService) {}

    @Get('/')
    public async creditAmountsList() {
        return await this.service.getCreditAmounts();
    }
}
