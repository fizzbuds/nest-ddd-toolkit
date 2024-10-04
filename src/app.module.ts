import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from './env-validation-schema';
import { RegistrationModule } from './registration/registration.module';
import { AccountingModule } from './accounting/accounting.module';
import { MongoModule } from '@golee/mongo-nest';
import { EventBusModule } from './@infra/event-bus/event-bus.module';

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
                        transport: config.get('LOG_PRETTY') ? { target: 'pino-pretty' } : undefined,
                    },
                };
            },
        }),
        MongoModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.getOrThrow('MONGODB_URI'),
            }),
        }),
        EventBusModule,
        RegistrationModule,
        AccountingModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
