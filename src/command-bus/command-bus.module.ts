import { Global, Logger, Module } from '@nestjs/common';
import { LocalCommandBus } from '@fizzbuds/ddd-toolkit';

export const COMMAND_BUS = 'COMMAND_BUS';

@Global()
@Module({
    providers: [
        {
            provide: COMMAND_BUS,
            useFactory: () => {
                const logger = new Logger('CommandBus');
                return new LocalCommandBus(logger);
            },
        },
    ],
    imports: [],
    exports: [COMMAND_BUS],
})
export class CommandBusModule {}
