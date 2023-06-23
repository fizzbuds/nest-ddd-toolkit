import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private readonly config: ConfigService) {}

    private readonly logger = new Logger(AppService.name);

    getHello(): string {
        this.logger.debug(`hello world ${this.config.getOrThrow('LOG_LEVEL')}`);
        return 'Hello World!';
    }
}
