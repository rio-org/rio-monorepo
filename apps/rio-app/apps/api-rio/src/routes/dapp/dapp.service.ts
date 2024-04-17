import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getDrizzlePool, apiSchema } from '@internal/db';
import {
  DatabaseService,
  LoggerService,
  SUPPORTED_CHAIN_IDS,
} from '@rio-app/common';

@Injectable()
export class DappService {
  private readonly drizzlePool: ReturnType<typeof getDrizzlePool>;
  constructor(
    private readonly _logger: LoggerService,
    private readonly _databaseService: DatabaseService,
  ) {
    this._logger.setContext(this.constructor.name);
    this.drizzlePool = this._databaseService.getApiPoolConnection();
  }

  /**
   *
   * @param restakingToken The token to pull the reward rate for
   * @param chainId The chain to pull data for
   * @param txHash The transaction hash of the deposit
   * @param ip The Ip address of the user
   */
  async saveDepositTxHash(
    restakingToken: string,
    chainId: (typeof SUPPORTED_CHAIN_IDS)[number],
    txHash: string,
    ip: string,
  ): Promise<boolean> {
    const { dappDeposit } = apiSchema;
    const { db } = this.drizzlePool;

    try {
      const inserts = await db
        .insert(dappDeposit)
        .values({
          chainId,
          restakingToken,
          ip,
          txHash,
        })
        .returning();
      this._logger.log(`Inserted txhash for ${JSON.stringify(inserts)}`);

      return true;
    } catch (e) {
      const msg = `Failed to insert tx hash for ${txHash}, Token: ${restakingToken}, Chain: ${chainId}, Ip: ${ip}, Error: ${e.message}`;
      if (
        e.message
          .toString()
          .includes('duplicate key value violates unique constraint')
      ) {
        this._logger.warn(msg);
        return true;
      } else {
        this._logger.error(msg);
        throw new HttpException(
          `Internal Server Error`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
