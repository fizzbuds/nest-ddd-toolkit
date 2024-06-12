import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
    constructor(private readonly config: ConfigService) {}

    @Get()
    getHello() {
        return `nest-ddd-toolkit example hello from ${this.config.getOrThrow('ENV_NAME')} env`;
    }

    @Get('/health')
    health() {
        return;
    }
}
