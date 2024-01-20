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
  WithdrawalRequest_OrderBy,
  WithdrawalRequest_Filter,
  WithdrawalClaim_OrderBy,
  WithdrawalClaim_Filter,
  Operator_OrderBy,
  Operator_Filter
} from './generated/graphql';
import {
  IssuerQuery,
  LiquidRestakingTokenQuery,
  ManyDepositsQuery,
  ManyWithdrawalRequestsQuery,
  ManyWithdrawalClaimsQuery,
  ManyLiquidRestakingTokensQuery,
  ManyOperatorsQuery
} from './queries';
import {
  WithdrawalRequest,
  Issuer,
  Deposit,
  LiquidRestakingToken,
  QueryConfig,
  WithdrawalEpochStatus,
  WithdrawalClaim,
  Operator
} from './types';
import { GraphQLClient } from 'graphql-request';
import BN from 'big.js';

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
   * Get information about one or more liquid restaking tokens.
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
   * Get information about one or more deposits.
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
        valueUSD,
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
        valueUSD,
        restakingToken: restakingToken.id,
        userBalanceAfter,
        timestamp,
        blockNumber,
        tx
      })
    );
  }

  /**
   * Get information about one or more withdrawal requests.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getWithdrawalRequests(
    config: Partial<
      QueryConfig<WithdrawalRequest_OrderBy, WithdrawalRequest_Filter>
    > = {}
  ): Promise<WithdrawalRequest[]> {
    const { withdrawalRequests } = await this._gql.request(
      ManyWithdrawalRequestsQuery,
      toPaginated(
        this.merge(getDefaultConfig(WithdrawalRequest_OrderBy.Id), config)
      )
    );
    // prettier-ignore
    return withdrawalRequests.map(
      ({
        id,
        sender,
        epoch,
        assetOut,
        sharesOwed,
        amountIn,
        restakingToken,
        userBalanceAfter,
        valueUSD,
        timestamp,
        blockNumber,
        tx,
        isClaimed,
        claim
      }) => {
        const isReadyToClaim = (epoch.status as WithdrawalEpochStatus) === WithdrawalEpochStatus.Settled;
        const amountOut = isReadyToClaim && BN(sharesOwed).mul(epoch.assetsReceived).div(epoch.sharesOwed).round(
          18, BN.roundDown
        )?.toString() || null;
        return {
          id,
          sender,
          epoch: epoch.epoch,
          epochStatus: epoch.status,
          assetOut: assetOut.id,
          amountOut,
          sharesOwed,
          amountIn,
          valueUSD,
          restakingToken: restakingToken.id,
          userBalanceAfter,
          timestamp,
          blockNumber,
          tx,
  
          isClaimed,
          claimId: claim?.id ?? null,
          claimTx: claim?.tx ?? null,
          isReadyToClaim
        }
      });
  }

  /**
   * Get information about one or more withdrawal claims.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getWithdrawalClaims(
    config: Partial<
      QueryConfig<WithdrawalClaim_OrderBy, WithdrawalClaim_Filter>
    > = {}
  ): Promise<WithdrawalClaim[]> {
    const { withdrawalClaims } = await this._gql.request(
      ManyWithdrawalClaimsQuery,
      toPaginated(
        this.merge(getDefaultConfig(WithdrawalClaim_OrderBy.Id), config)
      )
    );
    return withdrawalClaims.map(
      ({
        id,
        sender,
        epoch,
        assetOut,
        amountOut,
        valueUSD,
        restakingToken,
        requests,
        timestamp,
        blockNumber,
        tx
      }) => ({
        id,
        sender,
        epoch: epoch.epoch,
        assetOut: assetOut.id,
        amountClaimed: amountOut,
        valueUSD,
        restakingToken: restakingToken.id,
        requestIds: requests?.map(({ id }) => id) ?? [],
        timestamp,
        blockNumber,
        tx
      })
    );
  }

  /**
   * Get information about one or more operators.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getOperators(
    config: Partial<QueryConfig<Operator_OrderBy, Operator_Filter>> = {}
  ): Promise<Operator[]> {
    const { operators } = await this._gql.request(
      ManyOperatorsQuery,
      toPaginated(
        this.merge(getDefaultConfig(Operator_OrderBy.OperatorId), config)
      )
    );
    return operators.map(
      ({
        operatorId,
        address,
        delegator,
        manager,
        earningsReceiver,
        metadataURI,
        metadata,
        delegationApprover,
        stakerOptOutWindowBlocks,
        restakingToken
      }) => ({
        operatorId,
        address,
        delegator,
        manager,
        earningsReceiver,
        metadataURI,
        name: metadata?.name ?? null,
        website: metadata?.website ?? null,
        description: metadata?.description ?? null,
        logo: metadata?.logo ?? null,
        twitter: metadata?.twitter ?? null,
        delegationApprover,
        stakerOptOutWindowBlocks,
        restakingToken: restakingToken.id
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
      totalValueETH,
      totalValueUSD,
      exchangeRateETH,
      exchangeRateUSD,
      percentAPY,
      coordinator,
      withdrawalQueue,
      underlyingAssets
    } = raw;
    return {
      address,
      symbol,
      name,
      createdTimestamp,
      totalSupply,
      totalValueETH,
      totalValueUSD,
      exchangeRateETH,
      exchangeRateUSD,
      percentAPY,
      coordinator: coordinator.id,
      withdrawalQueue: withdrawalQueue.id,
      underlyingAssets:
        underlyingAssets?.map(
          ({
            address,
            strategy,
            depositCap,
            balance,
            asset: { symbol, name, latestUSDPrice, latestUSDPriceTimestamp }
          }) => ({
            address,
            symbol,
            name,
            strategy,
            depositCap,
            latestUSDPrice,
            latestUSDPriceTimestamp,
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
