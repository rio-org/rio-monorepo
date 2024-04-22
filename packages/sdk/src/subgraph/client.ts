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
  OperatorDelegator_OrderBy,
  OperatorDelegator_Filter,
  Validator_OrderBy,
  Validator_Filter,
  TokenTransfer_OrderBy,
  TokenTransfer_Filter
} from './generated/graphql';
import {
  IssuerQuery,
  LiquidRestakingTokenQuery,
  ManyDepositsQuery,
  ManyTokenTransfersQuery,
  ManyWithdrawalRequestsQuery,
  ManyWithdrawalClaimsQuery,
  ManyLiquidRestakingTokensQuery,
  ManyOperatorDelegatorsQuery,
  ManyValidatorsQuery
} from './queries';
import {
  WithdrawalRequest,
  Issuer,
  Deposit,
  TokenTransfer,
  LiquidRestakingToken,
  QueryConfig,
  WithdrawalEpochStatus,
  WithdrawalClaim,
  OperatorDelegator,
  Validator,
  SubgraphClientOptions
} from './types';
import { GraphQLClient } from 'graphql-request';
import BN from 'big.js';

export class SubgraphClient {
  private readonly _gql: GraphQLClient;

  private _chainId: number;
  private _options?: SubgraphClientOptions;
  /**
   * The Rio Network issuer ID.
   */
  public static readonly ISSUER_ID = 'ISSUER';

  /**
   * Returns a `SubgraphClient` instance for the provided chain ID
   * @param chainId The chain ID
   * @param options Optional configuration with custom subgraph URL and/or The Graph API key
   */
  public static for(chainId: number, options?: SubgraphClientOptions) {
    return new SubgraphClient(chainId, options);
  }

  /**
   * @param chainId The chain ID
   * @param options Optional configuration with custom subgraph URL and/or The Graph API key
   */
  constructor(chainId: number, options?: SubgraphClientOptions) {
    this._gql = new GraphQLClient(
      options?.subgraphUrl ??
        getSubgraphUrlForChainOrThrow(chainId, options?.subgraphApiKey)
    );
    this._chainId = chainId;
    this._options = options;
  }

  /**
   * Update the client options.
   * @param options Optional configuration with custom subgraph URL and/or The Graph API key
   */
  public updateClientOptions(options?: SubgraphClientOptions) {
    this._options = options ?? this._options;
    this._gql.setEndpoint(
      this._options?.subgraphUrl ??
        getSubgraphUrlForChainOrThrow(
          this._chainId,
          this._options?.subgraphApiKey
        )
    );
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
        restakingTokenPriceUSD,
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
        restakingTokenPriceUSD: restakingTokenPriceUSD ?? null,
        userBalanceAfter,
        timestamp,
        blockNumber,
        tx
      })
    );
  }

  /**
   * Get information about one or more TokenTransfers.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getTokenTransfers(
    config: Partial<
      QueryConfig<TokenTransfer_OrderBy, TokenTransfer_Filter>
    > = {}
  ): Promise<TokenTransfer[]> {
    const { tokenTransfers } = await this._gql.request(
      ManyTokenTransfersQuery,
      toPaginated(
        this.merge(getDefaultConfig(TokenTransfer_OrderBy.Id), config)
      )
    );
    return tokenTransfers.map(
      ({
        id,
        sender,
        receiver,
        amount,
        restakingToken,
        restakingTokenPriceUSD,
        senderBalanceBefore,
        senderBalanceAfter,
        receiverBalanceBefore,
        receiverBalanceAfter,
        valueUSD,
        timestamp,
        blockNumber,
        tx
      }) => ({
        id,
        sender: sender.id,
        receiver: receiver.id,
        amount,
        restakingToken: restakingToken.id,
        senderBalanceBefore,
        senderBalanceAfter,
        receiverBalanceBefore,
        receiverBalanceAfter,
        restakingTokenPriceUSD: restakingTokenPriceUSD ?? null,
        valueUSD,
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
        amountIn,
        restakingToken,
        restakingTokenPriceUSD,
        userBalanceAfter,
        valueUSD,
        timestamp,
        blockNumber,
        tx,
        isClaimed,
        claim
      }) => {
        const isReadyToClaim = (epoch.status as WithdrawalEpochStatus) === WithdrawalEpochStatus.Settled;
        const amountOut = isReadyToClaim && BN(amountIn).mul(epoch.assetsReceived).div(epoch.amountIn).round(
          18, BN.roundDown
        )?.toString() || null;
        return {
          id,
          sender,
          epoch: epoch.epoch,
          epochStatus: epoch.status,
          assetOut: assetOut.id,
          amountOut,
          amountIn,
          valueUSD,
          restakingToken: restakingToken.id,
          restakingTokenPriceUSD: restakingTokenPriceUSD ?? null,
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
        restakingTokenPriceUSD,
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
        restakingTokenPriceUSD: restakingTokenPriceUSD ?? null,
        requestIds: requests?.map(({ id }) => id) ?? [],
        timestamp,
        blockNumber,
        tx
      })
    );
  }

  /**
   * Get information about one or more operator delegators, and their associated operators.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getOperatorDelegators(
    config: Partial<
      QueryConfig<OperatorDelegator_OrderBy, OperatorDelegator_Filter>
    > = {}
  ): Promise<OperatorDelegator[]> {
    const { operatorDelegators } = await this._gql.request(
      ManyOperatorDelegatorsQuery,
      toPaginated(
        this.merge(
          getDefaultConfig(OperatorDelegator_OrderBy.OperatorId),
          config
        )
      )
    );
    return operatorDelegators.map(
      ({
        delegatorId,
        address,
        operator: o,
        manager,
        earningsReceiver,
        unusedValidatorKeyCount,
        depositedValidatorKeyCount,
        exitedValidatorKeyCount,
        totalValidatorKeyCount,
        restakingToken
      }) => ({
        delegatorId,
        address,
        manager,
        operator: {
          address: o.address,
          metadataURI: o.metadataURI,
          name: o.metadata?.name ?? null,
          website: o.metadata?.website ?? null,
          description: o.metadata?.description ?? null,
          logo: o.metadata?.logo ?? null,
          twitter: o.metadata?.twitter ?? null,
          delegationApprover: o.delegationApprover,
          stakerOptOutWindowBlocks: o.stakerOptOutWindowBlocks
        },
        earningsReceiver,
        unusedValidatorKeyCount,
        depositedValidatorKeyCount,
        exitedValidatorKeyCount,
        totalValidatorKeyCount,
        restakingToken: restakingToken.id
      })
    );
  }

  /**
   * Get information about one or more validators, and their operator delegators.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getValidators(
    config: Partial<QueryConfig<Validator_OrderBy, Validator_Filter>> = {}
  ): Promise<Validator[]> {
    const { validators } = await this._gql.request(
      ManyValidatorsQuery,
      toPaginated(
        this.merge(getDefaultConfig(Validator_OrderBy.KeyIndex), config)
      )
    );
    return validators.map(
      ({
        status,
        delegator,
        keyIndex,
        publicKey,
        keyUploadTimestamp,
        keyUploadTx
      }) => ({
        status,
        delegator: delegator.id,
        keyIndex,
        publicKey,
        keyUploadTimestamp,
        keyUploadTx
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
      coordinator,
      assetRegistry,
      operatorRegistry,
      avsRegistry,
      depositPool,
      withdrawalQueue,
      rewardDistributor,
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
      deployment: {
        coordinator: coordinator.id,
        assetRegistry: assetRegistry.id,
        operatorRegistry: operatorRegistry.id,
        avsRegistry: avsRegistry.id,
        depositPool: depositPool.id,
        withdrawalQueue: withdrawalQueue.id,
        rewardDistributor: rewardDistributor.id
      },
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
