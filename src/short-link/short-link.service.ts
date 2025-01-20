import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ShortLinkDocument } from '../firestore/documents/short-link.document';
import { CollectionReference } from '@google-cloud/firestore';
import { HashService } from '../hash/hash.service';

@Injectable()
export class ShortLinkService {
  private readonly logger = new Logger(ShortLinkService.name, {
    timestamp: true,
  });

  constructor(
    @Inject(ShortLinkDocument.collectionName)
    private todosCollection: CollectionReference<ShortLinkDocument>,
    private hashService: HashService,
  ) {}

  async create(url: string) {
    let shortHash = this.hashService.generateShortHash(url);

    let docRef = this.todosCollection.doc(shortHash);
    let document = await docRef.get();
    let attemptCount = 0;

    // We have a hash conflict here
    while (document.exists && document.data()?.url !== url) {
      this.logger.log(
        `Found a hash collision for ${url} on attempt ${attemptCount}`,
      );
      attemptCount++;
      shortHash = this.hashService.generateShortHash(url, attemptCount);
      docRef = this.todosCollection.doc(shortHash);
      document = await docRef.get();
    }

    await docRef.set({ url });
    return shortHash;
  }

  async getOriginalUrl(shortLinkId: string) {
    const document = await this.todosCollection.doc(shortLinkId).get();
    if (!document.exists) {
      throw new NotFoundException();
    } else {
      return document.data()?.url;
    }
  }
}
