import { Controller, Get } from '@nestjs/common';
import { AccountingQueryBus } from '../@infra/accounting.query-bus';
import { GetCreditAmountsQuery } from '../queries/get-credit-amounts.query-handler';

@Controller('accounting/credit-amounts')
export class CreditAmountController {
    constructor(private readonly accountingQueryBus: AccountingQueryBus) {}

    @Get('/')
    public async creditAmountsList() {
        return await this.accountingQueryBus.execute(new GetCreditAmountsQuery({}));
    }
}
