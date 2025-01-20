import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;
  const url = 'https://google.com';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateShortHash', () => {
    it('should generate a short hash for a given URL', () => {
      const shortHash = service.generateShortHash(url);
      expect(shortHash).toEqual(expect.any(String));
    });

    it('should generate a base62 string', () => {
      const shortHash = service.generateShortHash(url);
      expect(shortHash).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should generate the same hash for the same URL', () => {
      const shortHash1 = service.generateShortHash(url);
      const shortHash2 = service.generateShortHash(url);
      expect(shortHash1).toBe(shortHash2);
    });

    it('should generate different hashes for different URLs', () => {
      const anotherUrl = 'https://example.com';
      const shortHash1 = service.generateShortHash(url);
      const shortHash2 = service.generateShortHash(anotherUrl);
      expect(shortHash1).not.toBe(shortHash2);
    });

    it('should handle rehashing if there is a conflict (rehashCount > 0)', () => {
      const url = 'https://example.com';
      const initialHash = service.generateShortHash(url);
      const rehashed = service.generateShortHash(url, 1);
      expect(rehashed).not.toBe(initialHash);
    });

    it('should handle empty URL', () => {
      const url = '';
      const shortHash = service.generateShortHash(url);
      expect(shortHash).toBeDefined();
      expect(shortHash).toEqual(expect.any(String));
    });
  });

  describe('encodeBase62', () => {
    it('should correctly encode a decimal value to Base62', () => {
      const value = BigInt(123456);
      const encoded = (service as any).encodeBase62(value); // Accessing private method for testing
      expect(encoded).toBeDefined();
      expect(encoded).toBe('W7E'); // The expected Base62 encoding of the value 123456
    });
  });
});
