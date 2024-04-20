import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { LocalEventBus } from '@fizzbuds/ddd-toolkit';

export const EVENT_BUS = 'EVENT_BUS';

@Injectable()
export class EventBus extends LocalEventBus {
    constructor() {
        super(new Logger(EventBus.name));
    }
}

@Global()
@Module({
    providers: [{ provide: EVENT_BUS, useClass: EventBus }],
    imports: [],
    exports: [EVENT_BUS],
})
export class EventBusModule {}
