import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinkService } from './short-link.service';
import { ShortLinkDocument } from '../firestore/documents/short-link.document';
import { HashService } from '../hash/hash.service';
import { CollectionReference, DocumentSnapshot } from '@google-cloud/firestore';
import { NotFoundException } from '@nestjs/common';

describe('ShortLinkService', () => {
  let service: ShortLinkService;
  let mockTodosCollection: jest.Mocked<CollectionReference<ShortLinkDocument>>;
  let mockHashService: jest.Mocked<HashService>;

  // Helper function to mock Firestore document methods -- theres likely a better way of doing this
  const mockDocument = (exists: boolean, url?: string): any => {
    const mockDocSnapshot: Partial<DocumentSnapshot<ShortLinkDocument>> = {
      exists,
      data: () => (exists ? { url: url ?? '' } : undefined),
    };

    return {
      get: jest.fn().mockResolvedValue(mockDocSnapshot),
      set: jest.fn().mockResolvedValue(undefined),
    };
  };

  beforeEach(async () => {
    mockTodosCollection = {
      doc: jest.fn(),
    } as unknown as jest.Mocked<CollectionReference<ShortLinkDocument>>;

    mockHashService = {
      generateShortHash: jest.fn(),
    } as unknown as jest.Mocked<HashService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortLinkService,
        {
          provide: ShortLinkDocument.collectionName,
          useValue: mockTodosCollection,
        },
        { provide: HashService, useValue: mockHashService },
      ],
    }).compile();

    service = module.get<ShortLinkService>(ShortLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should generate a short link and store it', async () => {
      const url = 'https://example.com';
      const shortHash = 'abc123';

      // Mock the Firestore document and set it up to simulate no existing document
      mockTodosCollection.doc.mockReturnValue(mockDocument(false));

      mockHashService.generateShortHash.mockReturnValue(shortHash);

      const result = await service.create(url);

      expect(result).toBe(shortHash);
      expect(mockTodosCollection.doc).toHaveBeenCalledWith(shortHash);
      expect(mockTodosCollection.doc().set).toHaveBeenCalledWith({ url });
    });

    it('should handle hash collisions and retry generating short hash', async () => {
      const url = 'https://google.com';
      const shortHash1 = 'abc123';
      const shortHash2 = 'def456';

      // Mock the first document to simulate a collision (exists: true, but different URL)
      mockTodosCollection.doc
        .mockReturnValueOnce(mockDocument(true, 'https://example.com'))
        .mockReturnValue(mockDocument(false));

      mockHashService.generateShortHash
        .mockReturnValueOnce(shortHash1)
        .mockReturnValueOnce(shortHash2);

      const result = await service.create(url);
      expect(mockHashService.generateShortHash).toHaveBeenCalledTimes(2); // Retried once due to collision
      expect(result).toBe(shortHash2);
      expect(mockTodosCollection.doc).toHaveBeenCalledWith(shortHash2);
      expect(mockTodosCollection.doc().set).toHaveBeenCalledWith({ url });
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL if the short link exists', async () => {
      const shortLinkId = 'abc123';
      const originalUrl = 'https://google.com';

      // Mock the Firestore document as exists and contains the URL
      mockTodosCollection.doc.mockReturnValue(mockDocument(true, originalUrl));

      const result = await service.getOriginalUrl(shortLinkId);

      expect(result).toBe(originalUrl);
      expect(mockTodosCollection.doc).toHaveBeenCalledWith(shortLinkId);
    });

    it('should throw a NotFoundException if the short link does not exist', async () => {
      const shortLinkId = 'nonexistent';
      mockTodosCollection.doc.mockReturnValue(mockDocument(false));

      await expect(service.getOriginalUrl(shortLinkId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTodosCollection.doc).toHaveBeenCalledWith(shortLinkId);
    });
  });
});
