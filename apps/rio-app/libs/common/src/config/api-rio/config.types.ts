import { ThrottlerOptions } from '@nestjs/throttler';

/**
 * Rio API configuration values
 */
export interface ApiRioConfig {
  throttlers: ThrottlerOptions[];

  rootLocation: string;
}
