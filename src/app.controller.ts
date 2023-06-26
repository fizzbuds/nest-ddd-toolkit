import { Controller, Get, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, STATES } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Request } from 'express';

@Controller()
export class AppController {
    constructor(private readonly config: ConfigService, @InjectConnection() private readonly connection: Connection) {}

    @Get()
    getHello(@Req() req: Request) {
        return `Hello from ${this.config.getOrThrow('ENV_NAME')} env`;
    }

    @Get('/health')
    health() {
        return { mongoConnectionStatus: STATES[this.connection.readyState] };
    }
}
