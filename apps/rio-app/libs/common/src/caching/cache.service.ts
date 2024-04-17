import { Cache } from 'cache-manager';
import { CommonCache, LoggerService } from '../';

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
          await this._cacheService.set(cacheKey, cacheData, cacheInterval);
        } else {
          await this._cacheService.set(cacheKey, cacheData);
        }
      } else {
        await this._cacheService.del(cacheKey);
      }
    } catch (e) {
      this._logger.error(`Could not set cache: (${e.message})`, cacheKey);
    }
  }
}
