import { Controller, Get } from '@nestjs/common';
import { GetFeesQuery } from '../queries/get-fees.query-handler';
import { AccountingQueryBus } from '../infrastructure/accounting.query-bus';

@Controller('accounting/fees')
export class FeesController {
    constructor(private readonly accountingQueryBus: AccountingQueryBus) {}

    @Get('/')
    public async feesList() {
        return await this.accountingQueryBus.execute(new GetFeesQuery({}));
    }
}
