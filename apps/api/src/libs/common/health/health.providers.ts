import { Transport } from '@nestjs/microservices';
import {
  HealthIndicatorFunction,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthModuleOptions, HealthProvider } from './health.types';

export class HealthProviders {
  /**
   * Create a provider that returns all required health check indicators
   */
  public static createHealthChecksProvider() {
    return {
      provide: HealthProvider.HEALTH_CHECKS,
      useFactory: (
        options: HealthModuleOptions,
        database: TypeOrmHealthIndicator,
        microservice: MicroserviceHealthIndicator,
      ) => {
        const checks: HealthIndicatorFunction[] = [];

        const timeout = 3000;

        if (options?.redis) {
          checks.push(() =>
            microservice.pingCheck('redis', {
              transport: Transport.TCP,
              timeout,
              options: options.redis,
            }),
          );
        }
        if (options?.database) {
          checks.push(() =>
            database.pingCheck('database', {
              timeout: options.database?.healthCheckTimeout || timeout,
            }),
          );
        }
        return checks;
      },
      inject: [
        HealthProvider.HEALTH_MODULE_OPTIONS,
        TypeOrmHealthIndicator,
        MicroserviceHealthIndicator,
      ],
    };
  }
}
