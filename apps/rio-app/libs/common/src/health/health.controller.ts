import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthIndicatorFunction } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HealthProvider } from './health.types';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(
    @Inject(HealthProvider.HEALTH_CHECKS)
    private readonly _checks: HealthIndicatorFunction[],
    private readonly _healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck() {
    return this._healthService.healthCheck(this._checks);
  }
}
