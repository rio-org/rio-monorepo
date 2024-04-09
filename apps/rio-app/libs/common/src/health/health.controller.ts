import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthIndicatorFunction } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HealthProvider } from './health.types';
import { SkipThrottle } from '@nestjs/throttler';
import { skipAllThrottles } from '../config';

@Controller('/')
export class HealthController {
  constructor(
    @Inject(HealthProvider.HEALTH_CHECKS)
    private readonly _checks: HealthIndicatorFunction[],
    private readonly _healthService: HealthService,
  ) {}

  @Get('health')
  @HealthCheck({ noCache: true })
  // list out all throttles that are turned off for a specific endpoint
  @SkipThrottle(skipAllThrottles)
  async healthCheck() {
    return this._healthService.healthCheck(this._checks);
  }

  @Get('ping')
  @HealthCheck({ noCache: true })
  // list out all throttles that are turned off for a specific endpoint
  @SkipThrottle(skipAllThrottles)
  async ping() {
    return;
  }
}
