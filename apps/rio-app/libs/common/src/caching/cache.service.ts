import { LoggerService } from '@rio-app/common';
import { CommonCache } from '../';
import { Cache } from 'cache-manager';

export default abstract class CacheService implements CommonCache {
  constructor(
    protected readonly _cacheService: Cache,
    protected readonly _logger: LoggerService,
  ) {
    this._logger.setContext(this.constructor.name);
  }

  /**
   * Get the cached data
   * @param cacheKey cache key
   */
  public async getCache<T>(cacheKey: string): Promise<T> {
    return this._cacheService.get<T>(cacheKey) as T;
  }

  /**
   * Cache the data
   * @param cacheKey cache key
   * @param cacheData (optional) data to cache
   * @param cacheInterval (optional) set the TTL
   */
  public async setCache<T>(
    cacheKey: string,
    cacheData?: T | any,
    cacheInterval?: number,
  ): Promise<void> {
    try {
      if (cacheData) {
        if (cacheInterval) {
          // @ts-ignore
          await this._cacheService.set<T>(cacheKey, cacheData, {
            ttl: cacheInterval,
          });
        } else {
          // @ts-ignore
          await this._cacheService.set<T>(cacheKey, cacheData);
        }
      } else {
        await this._cacheService.del(cacheKey);
      }
    } catch (e) {
      this._logger.error(
        // @ts-ignore
        `Could not set cache: (${e.message})`,
        undefined,
        cacheKey,
      );
    }
  }
}
