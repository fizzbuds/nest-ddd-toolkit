import { LocalQueryBus } from '@fizzbuds/ddd-toolkit';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MemberRegistrationQueryBus extends LocalQueryBus {
    constructor() {
        super(new Logger(MemberRegistrationQueryBus.name));
    }
}
