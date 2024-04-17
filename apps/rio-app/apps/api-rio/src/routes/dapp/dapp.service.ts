import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getDrizzlePool, schema } from '@internal/db';
import {
  DatabaseService,
  LoggerService,
  CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
  SUPPORTED_CHAIN_NAMES,
  RewardChainAndToken,
} from '@rio-app/common';

@Injectable()
export class DappService {
  private readonly drizzlePool: ReturnType<typeof getDrizzlePool>;
  constructor(
    private readonly _logger: LoggerService,
    private readonly _databaseService: DatabaseService,
  ) {
    this._logger.setContext(this.constructor.name);
    this.drizzlePool = this._databaseService.getPoolConnection();
  }

  /**
   * Retrieves the support token and chain from the request
   * @param token The token from the request
   * @param chain The chain from the request
   */
  async findTokenAndChain(
    token: string,
    chain:
      | (typeof SUPPORTED_CHAIN_IDS)[number]
      | (typeof SUPPORTED_CHAIN_NAMES)[number],
  ): Promise<RewardChainAndToken> {
    const { transfer } = schema;
    const { db } = this.drizzlePool;

    const eligibleTokensAndChains = await db
      .selectDistinct({ asset: transfer.asset, chainId: transfer.chainId })
      .from(transfer);

    const _token = eligibleTokensAndChains.find(
      ({ asset }) => asset.toLowerCase() === token.toLowerCase(),
    )?.asset;

    if (!_token)
      throw new HttpException(`Token not supported`, HttpStatus.NOT_FOUND);

    const _chainId = isNaN(Number(chain))
      ? (CHAIN_ID[`${chain}`.toUpperCase()] as number)
      : eligibleTokensAndChains.find(({ chainId }) => +chainId === +chain)
          ?.chainId;

    if (!_chainId)
      throw new HttpException(`Chain not supported`, HttpStatus.NOT_FOUND);

    return { _chainId, _token };
  }

  /**
   *
   * @param token The token to pull the reward rate for
   * @param chain The chain to pull data for
   * @param txHash The transaction hash of the deposit
   * @param ip The Ip address of the user
   */
  async saveDepositTxHash(
    token: string,
    chain:
      | (typeof SUPPORTED_CHAIN_IDS)[number]
      | (typeof SUPPORTED_CHAIN_NAMES)[number],
    txHash: string,
    ip: string,
  ): Promise<boolean> {
    const { dappDeposit } = schema;
    const { db } = this.drizzlePool;

    const { _chainId, _token } = await this.findTokenAndChain(token, chain);

    try {
      const inserts = await db
        .insert(dappDeposit)
        .values({
          chainId: _chainId,
          restakingToken: _token,
          ip,
          txHash,
        })
        .returning();
      this._logger.log(`Inserted txhash for ${JSON.stringify(inserts)}`);

      return true;
    } catch (e) {
      const msg = `Failed to insert tx hash for ${txHash}, Token: ${token}, Chain: ${chain}, Ip: ${ip}, Error: ${e.message}`;
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
