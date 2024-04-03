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
   * @param token The token to pull the reward rate for
   */
  getProtocolRewardRate(token: string): string {
    return `${token} lots`;
  }
}
