import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { createDynamicRootModule } from '../';
import { HealthController } from './health.controller';
import { HealthProviders } from './health.providers';
import { HealthService } from './health.service';
import { HealthIndicatorDns } from './health.indicator-dns';
import { HealthModuleOptions, HealthProvider } from './health.types';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';

@Module({})
export class HealthModule extends createDynamicRootModule<HealthModuleOptions>(
  HealthProvider.HEALTH_MODULE_OPTIONS,
  {
    providers: [
      HealthService,
      HealthIndicatorDns,
      HealthCheckExecutor,
      HealthProviders.createHealthChecksProvider(),
    ],
    controllers: [HealthController],
    imports: [TerminusModule],
  },
) {}
