import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { LocalEventBus } from '@fizzbuds/ddd-toolkit';

@Injectable()
export class EventBus extends LocalEventBus {
    constructor() {
        super(new Logger(EventBus.name));
    }
}

@Global()
@Module({
    providers: [EventBus],
    imports: [],
    exports: [EventBus],
})
export class EventBusModule {}
