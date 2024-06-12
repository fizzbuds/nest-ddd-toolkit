import { LocalQueryBus } from '@fizzbuds/ddd-toolkit';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountingQueryBus extends LocalQueryBus {
    constructor() {
        super(new Logger(AccountingQueryBus.name));
    }
}
