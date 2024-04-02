import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  HealthCheckResult,
  HealthIndicatorFunction,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { HealthIndicatorDns } from './health.indicator-dns';

@Injectable()
export class HealthService {
  /**
   * Indicators that are only show as prometheus metrics
   * @private
   */
  private readonly _optionalIndicators: HealthIndicatorFunction[] = [
    async () => this._healthIndicator.check('dns', 'google.com'),
  ];

  private readonly _logger = new Logger(HealthService.name);

  constructor(
    // @Inject(HealthProvider.HEALTH_METRIC_GAUGE)
    // private readonly _gauge: Gauge<string>,
    private readonly _healthCheckExecutor: HealthCheckExecutor,
    private readonly _healthIndicator: HealthIndicatorDns,
  ) {}

  /**
   * Check indicators, return the results and report them as prometheus metrics
   * @param mandatoryIndicators functions to check, making the process unhealthy in case of failure
   */
  public async healthCheck(mandatoryIndicators: HealthIndicatorFunction[]) {
    await this.checkIndicators(this._optionalIndicators, false);
    return this.checkIndicators(mandatoryIndicators, true);
  }

  /**
   * Execute healthcheck functions
   * @param indicators functions to check
   * @param failOnError make the process unhealthy as well in case of failure
   * @private
   */
  private async checkIndicators(
    indicators: HealthIndicatorFunction[],
    failOnError: boolean,
  ): Promise<HealthCheckResult | undefined> {
    try {
      const results = await this.check(indicators);
      this.reportResults(results.details);
      return results;
    } catch (e) {
      // @ts-ignore
      this.reportResults(e.response?.details || {});
      if (failOnError) {
        throw e;
      }
    }
  }

  /**
   * Report healthcheck results as prometheus metrics
   * @param details check results to report
   * @private
   */
  private reportResults(details: HealthIndicatorResult) {
    for (const [check, result] of Object.entries(details)) {
      console.log({ check }, result);
      // this._gauge.set({ check }, result.status === 'up' ? 1 : 0);
    }
  }

  /**
   * Checks the given health indicators
   */
  private async check(
    healthIndicators: HealthIndicatorFunction[],
  ): Promise<HealthCheckResult> {
    const result = await this._healthCheckExecutor.execute(healthIndicators);
    if (result.status === 'ok') {
      return result;
    }
    const message = `Health Check has failed! ${JSON.stringify(result.error)}`;
    this._logger.log(message);
    throw new ServiceUnavailableException(result);
  }
}
