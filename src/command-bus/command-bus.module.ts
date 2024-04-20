import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { LocalCommandBus } from '@fizzbuds/ddd-toolkit';

@Injectable()
export class CommandBus extends LocalCommandBus {
    constructor() {
        super(new Logger(CommandBus.name));
    }
}

@Global()
@Module({
    providers: [CommandBus],
    imports: [],
    exports: [CommandBus],
})
export class CommandBusModule {}
