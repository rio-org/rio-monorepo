import { Injectable } from '@nestjs/common';
import { isString } from 'lodash';
import { ValidationService } from './validation.service';
import { DeepDotKey } from '../../index';

@Injectable()
export class FormatService {
  constructor(private readonly _validationService: ValidationService) {}

  /**
   * Combine parts to build an underscore delimited string
   * @param parts The parts of the cache key
   */
  public static combine<T>(...parts: Extract<T, string[]>): string {
    return parts.join('_').toString();
  }

  /**
   * Strip the hex prefix from the passed string if it exists
   * @param hex The hex string
   */
  public stripHexPrefix(hex: string): string {
    if (!isString(hex)) {
      return hex;
    }
    return hex.replace(/^(0x|0X)/, '');
  }

  /**
   * Strip the hex prefix and the length prefix from the passed string
   * @param hex The hex string
   */
  public bytesToRaw(hex: string): string {
    return this.stripHexPrefix(hex).slice(2);
  }

  /**
   * Determine if a string has a hex prefix
   * @param arg The string to check
   */
  public isHexPrefixed(arg: string): boolean {
    return arg.startsWith('0x');
  }

  /**
   * Add a hex prefix to an unprefixed string
   * @param arg The string to add the prefix to
   */
  public addHexPrefix(arg: string): string {
    return this.isHexPrefixed(arg) ? arg : `0x${arg}`;
  }

  /**
   * Convert a hex string to an ascii string
   * @param arg The string to convert to ascii
   * @param encoding The encoding of the string to convert (Default: hex)
   */
  public toASCII(arg: string, encoding: BufferEncoding = 'hex'): string {
    return Buffer.from(this.stripHexPrefix(arg), encoding)
      .toString('ascii')
      .replace(/\0/g, '');
  }

  /**
   * Format hashes in a standard way
   * @param hash The hash to format
   */
  public hash(hash: string): string {
    if (!isString(hash)) {
      return hash;
    }
    return this.stripHexPrefix(hash).toLowerCase();
  }

  /**
   * Build a deep, type-safe, dot-notation property accessor.
   * This is useful for type-safe config access
   * Usage:
   *  const obj = {
   *    prop: {
   *     nestedProp: 'value',
   *    },
   *  };
   *  const _ = deepDotKey<typeof obj>();
   *  _.prop.nestedProp(); // Outputs 'prop.nestedProp'
   * @param prev An optional key prefix
   */
  public deepDotKey<T>(prev?: string | number): DeepDotKey<T> {
    return new Proxy<any>(() => prev, {
      get: (_, next) => {
        if (typeof next === 'symbol') {
          throw new Error('Cannot use symbols with deepDotKey.');
        }
        return this.deepDotKey(prev ? `${prev}.${next}` : next);
      },
    });
  }
}
