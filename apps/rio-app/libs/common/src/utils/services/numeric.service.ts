import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';

@Injectable()
export class NumericService {
  private readonly _hex = 16;
  private readonly _ten = 10;

  /**
   * Convert a hex string to BigNumber
   * @param hexString The hex representation of the number to convert
   */
  public hexToBigNumber(hexString: string): BigNumber {
    return new BigNumber(parseInt(hexString, this._hex));
  }

  /**
   * Convert a number to its hex representation
   * @param number The number to convert to hex
   */
  public toHexString(number: BigNumber): string {
    return number.toString(this._hex);
  }
}
