import { Injectable, Logger, Module } from '@nestjs/common';
import { LocalEventBus } from '@fizzbuds/ddd-toolkit/dist/event-bus/local-event-bus';

@Injectable()
export class EventBus extends LocalEventBus {
    constructor() {
        super(new Logger(EventBus.name));
    }
}
@Module({
    providers: [EventBus],
    imports: [],
    exports: [EventBus],
})
export class LocalEventBusModule {}
