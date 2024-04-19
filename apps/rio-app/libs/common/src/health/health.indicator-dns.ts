import { Injectable } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';
import * as dns from 'dns';
import { isError, tryF } from 'ts-try';

@Injectable()
export class HealthIndicatorDns extends HealthIndicator {
  /**
   * Use DNS lookup function to check a hostname
   * @param key name of the check
   * @param hostname hostname for the lookup
   */
  public async check(key: string, hostname: string) {
    const result = await tryF(async () => await dns.promises.lookup(hostname));
    if (isError(result)) {
      return super.getStatus(key, false, { message: result.message });
    }
    return super.getStatus(key, true, { message: result.address });
  }
}
