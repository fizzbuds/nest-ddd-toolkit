import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private readonly config: ConfigService) {}

    private readonly logger = new Logger(AppService.name);

    getHello(): string {
        return `hello world from ${this.config.getOrThrow('ENV_NAME')}`;
    }
}
