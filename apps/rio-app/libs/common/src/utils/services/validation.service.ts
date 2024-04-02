import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {
  /**
   * Determine if the passed uuid is valid
   * @param uuid The UUID to test
   */
  public isValidUUID(uuid: string): boolean {
    if (
      new RegExp(
        /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i,
      ).test(uuid) // Valid UUID
    ) {
      return true;
    }
    return false;
  }

  /**
   * Determine if the passed string is a valid hex
   * @param s The string to validate
   */
  public isValidHex(s: string): boolean {
    if (
      new RegExp(/^(0x)?[a-f0-9]+$/i).test(s) // Valid hex
    ) {
      return true;
    }
    return false;
  }

  /**
   * Determine if the passed transaction hash is valid
   * @param hex The transaction hash to validate
   */
  public isValidTransactionHash(hex?: string) {
    return hex && new RegExp(/^0x([A-Fa-f0-9]{64})$/).test(hex);
  }

  /**
   * Determine if the current time has surpassed the timestamp
   * @param ts The timestamp to check
   */
  public isPastTimestamp(ts: number | Date): boolean {
    // @ts-ignore
    return Date.now() > ts;
  }
}
