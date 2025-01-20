import { Firestore } from '@google-cloud/firestore';
import { Controller, Get, Inject, VERSION_NEUTRAL } from '@nestjs/common';
import { FirestoreDatabaseProvider } from './firestore/firestore.providers';

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(
    @Inject(FirestoreDatabaseProvider) private firestore: Firestore,
  ) {}

  @Get('ping')
  ping() {
    return { message: 'pong' };
  }

  @Get('health-check')
  async healthCheck() {
    // Basic and naive firestore readiness check... theres probably something better
    await this.firestore.listCollections();

    return {
      service: 'ok',
      firestore: 'ok',
    };
  }
}
