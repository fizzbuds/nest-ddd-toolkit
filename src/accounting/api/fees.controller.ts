import { Controller, Get } from '@nestjs/common';
import { AccountingService } from '../accounting.service';

@Controller('accounting/fees')
export class FeesController {
    constructor(private readonly service: AccountingService) {}

    @Get('/')
    public async feesList() {
        return this.service.getFees();
    }
}
