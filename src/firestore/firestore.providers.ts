import { ShortLinkDocument } from './documents/short-link.document';

export const FirestoreDatabaseProvider = 'FIRE_STORE_DB';
export const FirestoreOptionsProvider = 'FIRE_STORE_OPTIONS';

export const FirestoreCollectionProviders: string[] = [
  ShortLinkDocument.collectionName,
];
