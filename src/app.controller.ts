import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, STATES } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller()
export class AppController {
    constructor(private readonly config: ConfigService, @InjectConnection() private readonly connection: Connection) {}

    @Get()
    getHello() {
        return `Hello from ${this.config.getOrThrow('ENV_NAME')} env`;
    }

    @Get('/health')
    health() {
        return { mongoConnectionStatus: STATES[this.connection.readyState] };
    }
}
