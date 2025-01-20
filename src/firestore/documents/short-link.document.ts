/**
 * Extremely simple document, this allows easy sharing and extremely efficient lookup of short links for the same URL by making the shortLinkSlug the document id.
 * If we wanted to support expiry or affiliate tracking we would need to add TTL support to the FireStore + a field here and create a unique link even for duplicates
 */
export class ShortLinkDocument {
  static collectionName = 'shortLinks';

  url: string;
}
