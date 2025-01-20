import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ConsoleLogger,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Little links')
    .setDescription('Little links API description')
    .setVersion('0.0.1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: process.env.JSON_LOGGING === 'true',
      prefix: 'Little Links',
    }),
  });

  setupSwagger(app);

  // Set up some strict auto-validation at the application level
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  // If we wanted/needed to we could set up helmet here to ensure CORS/CSP and other security related features are enabled.
  // Given the nature of this site / project it is not neccesary at this time

  app.setGlobalPrefix('/api');
  // Enable a standard global version for all routes in the URI
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
