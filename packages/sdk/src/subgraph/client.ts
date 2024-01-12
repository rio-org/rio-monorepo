import {
  getDefaultConfig,
  getSubgraphUrlForChainOrThrow,
  toPaginated
} from './utils';
import {
  Deposit_Filter,
  Deposit_OrderBy,
  LiquidRestakingToken_Filter,
  LiquidRestakingToken_OrderBy,
  LiquidRestakingTokenFieldsFragment,
  Withdrawal_OrderBy,
  Withdrawal_Filter
} from './generated/graphql';
import {
  IssuerQuery,
  LiquidRestakingTokenQuery,
  ManyDepositsQuery,
  ManyWithdrawalsQuery,
  ManyLiquidRestakingTokensQuery
} from './queries';
import {
  Withdrawal,
  Issuer,
  Deposit,
  LiquidRestakingToken,
  QueryConfig
} from './types';
import { GraphQLClient } from 'graphql-request';

export class SubgraphClient {
  private readonly _gql: GraphQLClient;

  /**
   * The Rio Network issuer ID.
   */
  public static readonly ISSUER_ID = 'ISSUER';

  /**
   * Returns a `SubgraphClient` instance for the provided chain ID
   * @param chainId The chain ID
   */
  public static for(chainId: number) {
    return new SubgraphClient(chainId);
  }

  /**
   * @param chainId The chain ID
   */
  constructor(chainId: number) {
    this._gql = new GraphQLClient(getSubgraphUrlForChainOrThrow(chainId));
  }

  /**
   * Get information about the Rio Network issuer.
   */
  public async getIssuer(): Promise<Issuer> {
    const { issuer } = await this._gql.request(IssuerQuery, {
      id: SubgraphClient.ISSUER_ID
    });
    if (!issuer) {
      throw new Error(`Issuer not found: ${SubgraphClient.ISSUER_ID}`);
    }
    const { address, tokensIssued, tokens } = issuer;
    return {
      address,
      tokensIssued,
      tokens: tokens?.map(({ id }) => id) ?? []
    };
  }

  /**
   * Get information about a specific liquid restaking token.
   * @param tokenAddress The address of the liquid restaking token to fetch.
   */
  public async getLiquidRestakingToken(
    tokenAddress: string
  ): Promise<LiquidRestakingToken> {
    const { liquidRestakingToken: token } = await this._gql.request(
      LiquidRestakingTokenQuery,
      {
        id: tokenAddress.toLowerCase()
      }
    );
    if (!token) {
      throw new Error(`LiquidRestakingToken not found: ${tokenAddress}`);
    }
    return this.toLiquidRestakingToken(token);
  }

  /**
   * Get information about a one or more liquid restaking tokens.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getLiquidRestakingTokens(
    config: Partial<
      QueryConfig<LiquidRestakingToken_OrderBy, LiquidRestakingToken_Filter>
    > = {}
  ): Promise<LiquidRestakingToken[]> {
    const { liquidRestakingTokens: tokens } = await this._gql.request(
      ManyLiquidRestakingTokensQuery,
      toPaginated(
        this.merge(getDefaultConfig(LiquidRestakingToken_OrderBy.Id), config)
      )
    );
    return tokens.map((token) => this.toLiquidRestakingToken(token));
  }

  /**
   * Get information about a one or more deposits.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getDeposits(
    config: Partial<QueryConfig<Deposit_OrderBy, Deposit_Filter>> = {}
  ): Promise<Deposit[]> {
    const { deposits } = await this._gql.request(
      ManyDepositsQuery,
      toPaginated(this.merge(getDefaultConfig(Deposit_OrderBy.Id), config))
    );
    return deposits.map(
      ({
        id,
        sender,
        assetIn,
        amountIn,
        amountOut,
        restakingToken,
        userBalanceAfter,
        timestamp,
        blockNumber,
        tx
      }) => ({
        id,
        sender,
        assetIn: assetIn.id,
        amountIn,
        amountOut,
        restakingToken: restakingToken.id,
        userBalanceAfter,
        timestamp,
        blockNumber,
        tx
      })
    );
  }

  /**
   * Get information about a one or more withdrawals.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getWithdrawals(
    config: Partial<QueryConfig<Withdrawal_OrderBy, Withdrawal_Filter>> = {}
  ): Promise<Withdrawal[]> {
    const { withdrawals } = await this._gql.request(
      ManyWithdrawalsQuery,
      toPaginated(this.merge(getDefaultConfig(Withdrawal_OrderBy.Id), config))
    );
    return withdrawals.map(
      ({
        id,
        sender,
        assetOut,
        sharesOwed,
        amountIn,
        restakingToken,
        userBalanceAfter,
        timestamp,
        blockNumber,
        requestTx,
        isReadyToClaim,
        isClaimed,
        amountOut,
        claimTx
      }) => ({
        id,
        sender,
        assetOut: assetOut.id,
        sharesOwed,
        amountIn,
        restakingToken: restakingToken.id,
        userBalanceAfter,
        timestamp,
        blockNumber,
        requestTx,
        isReadyToClaim,
        isClaimed,
        amountOut,
        claimTx
      })
    );
  }

  /**
   * Convert a raw `LiquidRestakingTokenFieldsFragment` object to a `LiquidRestakingToken`.
   * @param raw The raw `LiquidRestakingTokenFieldsFragment` object.
   */
  protected toLiquidRestakingToken(
    raw: LiquidRestakingTokenFieldsFragment
  ): LiquidRestakingToken {
    const {
      address,
      symbol,
      name,
      createdTimestamp,
      totalSupply,
      coordinator,
      underlyingAssets
    } = raw;
    return {
      address,
      symbol,
      name,
      createdTimestamp,
      totalSupply,
      coordinator: coordinator.id,
      underlyingAssets:
        underlyingAssets?.map(
          ({
            address,
            strategy,
            depositCap,
            priceFeed,
            balance,
            asset: { symbol, name }
          }) => ({
            address,
            symbol,
            name,
            strategy,
            depositCap,
            priceFeed,
            balance
          })
        ) ?? []
    };
  }

  /**
   * Merge a user and a default configuration
   * @param defaultConfig The default configuration
   * @param userConfig The user-provided partial configuration
   */
  protected merge<OB, W>(
    defaultConfig: QueryConfig<OB, W>,
    userConfig: Partial<QueryConfig<OB, W>>
  ) {
    return {
      ...defaultConfig,
      ...userConfig
    };
  }
}
