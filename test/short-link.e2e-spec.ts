import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getBootstrappedApp } from './helpers/full-server';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getBootstrappedApp();
    await app.init();
  });

  describe('/short-link (POST)', () => {
    it('rejects unknown body parameters with 400', () => {
      return request(app.getHttpServer())
        .post('/api/v1/short-link')
        .send({ someProperty: 'someValue', url: 'https://google.com' })
        .expect(400);
    });

    it('rejects invalid url body parameters with 400', () => {
      return request(app.getHttpServer())
        .post('/api/v1/short-link')
        .send({ url: 345 })
        .expect(400);
    });

    it('rejects url without protocol with 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/short-link')
        .send({ url: 'google.com' })
        .expect(400);

      expect(response.body.message).toContain(
        'url must be a full URL address including protocol',
      );
    });

    it('returns shortSlug and redirectUrl with valid payload', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/short-link')
        .send({ url: 'https://google.com' })
        .expect(201);

      expect(response.body.shortUrlSlug).toEqual(expect.any(String));
      expect(response.body.redirectUrl).toContain(`api/v1/short-link/`);
    });
  });

  describe('/short-link (GET)', () => {
    describe('invalid params', () => {
      it('rejects with 400 with invalid id', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/v1/short-link/some-clearly-invalid-id')
          .expect(400);

        expect(response.body.message).toContain(
          'The value (some-clearly-invalid-id) is not a valid Base62 string and therefore cannot be a valid short link',
        );
      });

      it('returns 404 if a valid but missing shortUrl is given', () => {
        // Little bit cheeky here, its basically impossible for the hash function to give this
        return request(app.getHttpServer())
          .get('/api/v1/short-link/0')
          .expect(404);
      });
    });

    describe('valid params', () => {
      let originalUrl = 'https://google.com';
      let shortUrl: string;
      beforeEach(async () => {
        const response = await request(app.getHttpServer())
          .post('/api/v1/short-link')
          .send({ url: originalUrl });

        shortUrl = `/api/v1/short-link/${response.body.shortUrlSlug}`;
      });

      it('should return 302 status code', () => {
        return request(app.getHttpServer()).get(shortUrl).expect(302);
      });

      it('should set the Location header as the original url', () => {
        return request(app.getHttpServer())
          .get(shortUrl)
          .expect('Location', originalUrl);
      });
    });
  });
});
