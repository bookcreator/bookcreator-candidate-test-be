import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ping (GET) - Returns pong if the server is responsive', () => {
    return request(app.getHttpServer())
      .get('/ping')
      .expect(200)
      .expect({ message: 'pong' });
  });

  it('/health-check (GET) - Returns firestore and service status', () => {
    return request(app.getHttpServer())
      .get('/health-check')
      .expect(200)
      .expect({ service: 'ok', firestore: 'ok' });
  });
});
