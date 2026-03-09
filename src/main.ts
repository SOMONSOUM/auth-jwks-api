import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filter/all-exceptions.filter';
import { TransformResponseInterceptor } from './common/interceptor/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const host = configService.get<string>('HOST', 'localhost');
  const port = configService.get<number>('PORT', 3000);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api', { exclude: ['/health', '/docs'] });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages:
        configService.get<string>('NODE_ENV') === 'production',
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('JWKS Authentication API')
    .setDescription('The JWKS Authentication API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.enableShutdownHooks();

  await app.listen(port, host);
  Logger.log(`🚀 Server is running on: http://localhost:${port ?? 3000}/api`);
  Logger.log(
    `🚀 Swagger API documentation: http://localhost:${port ?? 3000}/docs`,
  );
}
bootstrap();
