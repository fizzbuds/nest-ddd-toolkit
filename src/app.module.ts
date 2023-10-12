import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from './env-validation-schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ExampleModule } from './example/example.module';
import { RequestId } from './common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
        }),

        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    pinoHttp: {
                        level: config.getOrThrow('LOG_LEVEL'),
                        genReqId: () => RequestId.generate().toString(),
                        transport: config.get('LOG_PRETTY') ? { target: 'pino-pretty' } : undefined,
                    },
                };
            },
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.getOrThrow('MONGODB_URI'),
            }),
        }),
        ExampleModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
