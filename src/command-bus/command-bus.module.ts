import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { LocalCommandBus } from '@fizzbuds/ddd-toolkit';

export const COMMAND_BUS = 'COMMAND_BUS';

@Injectable()
export class CommandBus extends LocalCommandBus {
    constructor() {
        super(new Logger(CommandBus.name));
    }
}

@Global()
@Module({
    providers: [{ provide: COMMAND_BUS, useClass: CommandBus }],
    imports: [],
    exports: [COMMAND_BUS],
})
export class CommandBusModule {}
