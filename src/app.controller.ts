import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
    constructor(private readonly config: ConfigService) {}

    @Get()
    getHello() {
        return `Hello from ${this.config.getOrThrow('ENV_NAME')} env`;
    }
}
