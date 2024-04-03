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
   * Calculates the total protocol rewards for a given token
   * @param token The token to pull the reward rate for
   */
  getProtocolRewardRate(token: string): string {
    return `${token} lots`;
  }

  /**
   * Calculates the rewards for a given token and address
   * @param token The token to pull the reward rate for
   */
  getAddressRewardRate(token: string, address: string): string {
    return `${token} ${address} lots`;
  }
}
