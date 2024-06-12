import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.useLogger(app.get(Logger));
    app.useGlobalPipes(new ValidationPipe());

    const openApiConfig = new DocumentBuilder()
        .setTitle('ddd-toolkit-nest')
        .setDescription('Example API for ddd-toolkit-nest')
        .setVersion('1.0')
        .build();
    const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);
    SwaggerModule.setup('api', app, openApiDocument);

    app.getHttpAdapter().getInstance().disable('x-powered-by');
    const configService = app.get(ConfigService);
    await app.listen(configService.getOrThrow('APP_PORT'));
}

bootstrap();
