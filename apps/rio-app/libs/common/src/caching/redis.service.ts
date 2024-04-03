import { Inject, Injectable } from '@nestjs/common';
import { RedisCacheUtils } from '.';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import CacheService from './cache.service';
import { BufferCache, LoggerService } from '../';

@Injectable()
export class RedisCacheService extends CacheService implements BufferCache {
  constructor(
    @Inject(CACHE_MANAGER) protected readonly _cacheService: Cache,
    protected readonly _logger: LoggerService,
  ) {
    super(_cacheService, _logger);
    this._logger.setContext(this.constructor.name);
  }

  /**
   * Generates the key used to cache data in Redis
   * @param vals array of values used to generate a Redis cache key
   */
  public generateCacheKey(vals: string[]): string {
    return RedisCacheUtils.generateCacheKey(vals);
  }

  /**
   * Get the TTL of the cached data from Redis
   * @param cacheKey cache key
   */
  public async getCacheTtl(cacheKey: string): Promise<number | undefined> {
    try {
      return this._cacheService.store.ttl(cacheKey);
    } catch (e) {
      this._logger.error(
        `Could not get cache ttl: (${e.message})`,
        undefined,
        cacheKey,
      );
    }
  }

  /**
   * Get the cached buffer
   * @param cacheKey cache key
   * @param cleanupBadData (optional, default false) do we remove the cached data if we cannot read it?
   */
  public async getBuffer(
    cacheKey: string,
    cleanupBadData = false,
  ): Promise<Buffer | undefined | null> {
    try {
      const buffer = await this.getCache<Buffer>(cacheKey);

      return buffer ? Buffer.from(buffer) : null;
    } catch (e) {
      this._logger.error(
        `Could not get buffer: (${e.message})`,
        undefined,
        cacheKey,
      );

      if (cleanupBadData) {
        // Delete the "bad" data
        await this.setCache(cacheKey);
      }
    }
  }
}
