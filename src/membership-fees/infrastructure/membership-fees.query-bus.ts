import { LocalQueryBus } from '@fizzbuds/ddd-toolkit';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MembershipFeesQueryBus extends LocalQueryBus {
    constructor() {
        super(new Logger(MembershipFeesQueryBus.name));
    }
}
