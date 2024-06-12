import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
    constructor(private readonly config: ConfigService) {}

    @Get()
    getHello(@Req() req: Request) {
        return `nest-ddd-toolkit example\n
                Hello from ${this.config.getOrThrow('ENV_NAME')} env`;
    }

    @Get('/health')
    health() {
        return;
    }
}
