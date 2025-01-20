import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from './firestore/firestore.module';
import { ShortLinkModule } from './short-link/short-link.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().min(0).max(65535).default(3000),
      }),
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        databaseId: config.get('FIREBASE_DATABASE', '(default)')
      }),
      inject: [ConfigService],
    }),
    ShortLinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
