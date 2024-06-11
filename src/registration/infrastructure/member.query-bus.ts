import { LocalQueryBus } from '@fizzbuds/ddd-toolkit';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MemberQueryBus extends LocalQueryBus {
    constructor() {
        super(new Logger(MemberQueryBus.name));
    }
}
