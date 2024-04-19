import {
  Controller,
  Get,
  Inject,
  Ip,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MaintenanceService } from './maintenance.service';
import { ThrottlerBehindProxyGuard } from '../../guards';
import { RealIP } from 'nestjs-real-ip';

@Controller('maintenance')
@UseGuards(ThrottlerBehindProxyGuard)
export class MaintenanceController {
  constructor(
    private rewardsService: MaintenanceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/time')
  @CacheTTL(5) // seconds
  @UseInterceptors(CacheInterceptor)
  getTime(): string {
    return this.rewardsService.getTime();
  }

  @Get('/ip')
  @CacheTTL(5) // seconds
  @UseInterceptors(CacheInterceptor)
  getIp(@Ip() ip: string, @RealIP() realIp: string): string {
    return `internal ip=${ip} external ip=${realIp}`;
  }

  @Get('/reset-cache')
  @CacheTTL(5) // seconds
  @UseInterceptors(CacheInterceptor)
  async resetCache(): Promise<string> {
    await this.cacheManager.reset();
    return 'Cache reset';
  }

  @Get('/keys')
  @CacheTTL(5) // seconds
  @UseInterceptors(CacheInterceptor)
  keys(): Promise<any> {
    return this.cacheManager.store.keys();
  }
}
