import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
/**
 * Service to generate a basic 'shortHash' based on a longer string, just does md5 -> truncate -> int -> base62 encode for a short pleasing URL with a relatively large space
 * The DI and seperation of concerns makes it easy to replace the exact hash function later (or support multiple through a factory), although there is a small implicit coupling with the validation currently
 * to enable a better UX.
 */
export class HashService {
  private readonly base62Chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  /**
   * Generate a short hash based of a string.
   * @param string The original string.
   * @param rehashCount Number of rehashes to apply in case of conflict.
   * @returns A Base62 encoded short URL string.
   */
  generateShortHash(url: string, rehashCount = 0): string {
    let hash = createHash('md5').update(url).digest('hex');

    // Simple hash conflict resolution -- other approaches could be taken including a different hashing algorithm if this occurs often.
    for (let i = 0; i < rehashCount; ++i) {
      hash = createHash('md5').update(hash).digest('hex');
    }

    const shortHashHex = hash.substring(0, 12);
    const decimalValue = BigInt(`0x${shortHashHex}`);
    const shortUrl = this.encodeBase62(decimalValue);

    return shortUrl;
  }

  /**
   * Convert a decimal value to a Base62 encoded string.
   * @param value The decimal value to encode.
   * @returns The Base62 encoded string.
   */
  private encodeBase62(value: bigint): string {
    let result = '';
    const base = BigInt(this.base62Chars.length);

    while (value > 0) {
      const remainder = value % base;
      result = this.base62Chars[Number(remainder)] + result;
      value = value / base;
    }

    return result || '0';
  }
}
