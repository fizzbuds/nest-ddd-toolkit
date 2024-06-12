import { LocalQueryBus } from '@fizzbuds/ddd-toolkit';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MemberFeesQueryBus extends LocalQueryBus {
    constructor() {
        super(new Logger(MemberFeesQueryBus.name));
    }
}
