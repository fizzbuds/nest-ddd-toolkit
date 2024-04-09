import { Global, Logger, Module } from '@nestjs/common';
import { LocalEventBus } from '@fizzbuds/ddd-toolkit';

export const EVENT_BUS = 'EVENT_BUS';

@Global()
@Module({
    providers: [
        {
            provide: EVENT_BUS,
            useFactory: () => {
                const logger = new Logger('EventBus');
                return new LocalEventBus(logger);
            },
        },
    ],
    imports: [],
    exports: [EVENT_BUS],
})
export class EventBusModule {}
