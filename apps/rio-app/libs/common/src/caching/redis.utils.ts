export class RedisCacheUtils {
  /**
   * Generates the key used to cache data in Redis
   * @param vals array of values used to generate a Redis cache key
   */
  public static generateCacheKey(vals: string[]): string {
    return vals
      .map((v) => v?.replace(/ /g, '-'))
      .join('-')
      .toUpperCase();
  }
}
