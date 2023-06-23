import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    pinoHttp: {
                        level: config.getOrThrow('LOG_LEVEL'),
                        genReqId: () => uuidV4(),
                        transport: config.get('LOG_PRETTY') ? { target: 'pino-pretty' } : undefined,
                    },
                };
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
