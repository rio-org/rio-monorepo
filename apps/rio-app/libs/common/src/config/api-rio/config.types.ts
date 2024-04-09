import { ThrottlerOptions } from '@nestjs/throttler';

export const skipAllThrottles = { short: true, medium: true, long: true };

/**
 * Rio API configuration values
 */
export interface ApiRioConfig {
  throttlers: ThrottlerOptions[];

  rootLocation: string;
}
