import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {
  /**
   * Returns the current time in millis
   */
  getTime(): string {
    return Date.now().toString();
  }

  /**
   *
   */
  getProtocolRewardRate(): string {
    return 'lots';
  }
}
