import { RedisCacheUtils } from '.';

describe('RedisCacheUtils', () => {
  describe('generateCacheKey', () => {
    it('should generate the expected cache key(s)', () => {
      const part1 = 'PART1';
      const part2 = 'Pa rT2';
      const part3 = 'pA!@#rt$%^3';
      const cacheKey = RedisCacheUtils.generateCacheKey([part1, part2, part3]);

      expect(cacheKey).toEqual('PART1-PA-RT2-PA!@#RT$%^3');
    });
  });
});
