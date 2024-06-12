import { Injectable, Logger } from '@nestjs/common';
import { LocalCommandBus } from '@fizzbuds/ddd-toolkit';

@Injectable()
export class AccountingCommandBus extends LocalCommandBus {
    constructor() {
        super(new Logger(AccountingCommandBus.name));
    }
}
