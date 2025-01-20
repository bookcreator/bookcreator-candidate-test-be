const { generateShortHash } = require('../index'); 

describe('generateShortHash', () => {
  it('should generate a valid Base62 short hash for a given URL', () => {
    const url = 'http://example.com';
    const shortHash = generateShortHash(url);
    expect(shortHash).toMatch(/^[0-9A-Za-z]+$/);
    expect(shortHash.length).toBeGreaterThan(0);
  });

  it('should generate different hashes for different URLs', () => {
    const url1 = 'http://example.com';
    const url2 = 'http://example.org';
    const shortHash1 = generateShortHash(url1);
    const shortHash2 = generateShortHash(url2);
    expect(shortHash1).not.toBe(shortHash2);
  });

  it('should generate the same hash for the same URL with default rehashCount', () => {
    const url = 'http://example.com';
    const shortHash1 = generateShortHash(url);
    const shortHash2 = generateShortHash(url);
    expect(shortHash1).toBe(shortHash2);
  });

  it('should generate different hashes for the same URL with different rehashCounts', () => {
    const url = 'http://example.com';
    const shortHash1 = generateShortHash(url, 1);
    const shortHash2 = generateShortHash(url, 2);
    expect(shortHash1).not.toBe(shortHash2);
  });
});