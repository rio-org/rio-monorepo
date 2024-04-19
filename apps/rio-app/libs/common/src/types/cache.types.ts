export interface BufferCache {
  /**
   * Get the cached buffer
   * @param cacheKey cache key
   */
  getBuffer(cacheKey: string): Promise<Buffer | undefined | null>;

  /**
   * Set cache
   * @param cacheKey key
   * @param cacheData buffer to cache
   * @param cacheInterval the ttl
   */
  setCache(
    cacheKey: string,
    cacheData?: Buffer,
    cacheInterval?: number,
  ): Promise<void>;
}

export interface CommonCache {
  /**
   * Get the cached data
   * @param cacheKey cache key
   */
  getCache<T>(cacheKey: string): Promise<T>;

  /**
   * Cache the data
   * @param cacheKey cache key
   * @param cacheData (optional) data to cache
   * @param cacheInterval (optional) set the key w/ TTL
   */
  setCache<T>(
    cacheKey: string,
    cacheData?: T | any,
    cacheInterval?: number,
  ): Promise<void>;
}
