import {
  getDefaultConfig,
  getSubgraphUrlForChainOrThrow,
  toPaginated
} from './utils';
import {
  Join_Filter,
  Join_OrderBy,
  LiquidRestakingToken_Filter,
  LiquidRestakingToken_OrderBy,
  TokenWrapperFieldsFragment,
  LiquidRestakingTokenFieldsFragment,
  TokenWrapper_OrderBy,
  TokenWrapper_Filter,
  Exit_OrderBy,
  Exit_Filter
} from './generated/graphql';
import {
  IssuerQuery,
  LiquidRestakingTokenQuery,
  ManyJoinsQuery,
  ManyExitsQuery,
  ManyLiquidRestakingTokensQuery,
  ManyTokenWrappers,
  TokenWrapperQuery
} from './queries';
import {
  Exit,
  Issuer,
  Join,
  LiquidRestakingToken,
  QueryConfig,
  TokenWrapper
} from './types';
import { GraphQLClient } from 'graphql-request';

export class SubgraphClient {
  private readonly _gql: GraphQLClient;

  /**
   * The Rio Network issuer ID.
   */
  public static readonly ISSUER_ID = '1';

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
   * Get information about a specific token wrapper.
   * @param wrapperAddress The address of the token wrapper to fetch.
   */
  public async getTokenWrapper(wrapperAddress: string): Promise<TokenWrapper> {
    const { tokenWrapper } = await this._gql.request(TokenWrapperQuery, {
      id: wrapperAddress.toLowerCase()
    });
    if (!tokenWrapper) {
      throw new Error(`TokenWrapper not found: ${wrapperAddress}`);
    }
    return this.toTokenWrapper(tokenWrapper);
  }

  /**
   * Get information about a one or more token wrappers.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getTokenWrappers(
    config: Partial<QueryConfig<TokenWrapper_OrderBy, TokenWrapper_Filter>> = {}
  ): Promise<TokenWrapper[]> {
    const { tokenWrappers } = await this._gql.request(
      ManyTokenWrappers,
      toPaginated(this.merge(getDefaultConfig(TokenWrapper_OrderBy.Id), config))
    );
    return tokenWrappers.map((wrapper) => this.toTokenWrapper(wrapper));
  }

  /**
   * Get information about a one or more pool joins.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getJoins(
    config: Partial<QueryConfig<Join_OrderBy, Join_Filter>> = {}
  ): Promise<Join[]> {
    const { joins } = await this._gql.request(
      ManyJoinsQuery,
      toPaginated(this.merge(getDefaultConfig(Join_OrderBy.Id), config))
    );
    return joins.map(
      ({
        id,
        type,
        sender,
        tokensIn,
        amountsIn,
        amountOut,
        restakingToken,
        userBalanceAfter,
        timestamp,
        blockNumber,
        tx
      }) => ({
        id,
        type,
        sender,
        tokensIn: tokensIn.map(({ id }) => id),
        amountsIn,
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
   * Get information about a one or more pool exits.
   * @param config Filtering, pagination, and ordering configuration.
   */
  public async getExits(
    config: Partial<QueryConfig<Exit_OrderBy, Exit_Filter>> = {}
  ): Promise<Exit[]> {
    const { exits } = await this._gql.request(
      ManyExitsQuery,
      toPaginated(this.merge(getDefaultConfig(Exit_OrderBy.Id), config))
    );
    return exits.map(
      ({
        id,
        type,
        sender,
        tokensOut,
        amountsOut,
        sharesOwed,
        amountIn,
        restakingToken,
        userBalanceAfter,
        timestamp,
        blockNumber,
        tx
      }) => ({
        id,
        type,
        sender,
        tokensOut: tokensOut.map(({ id }) => id),
        amountsOut,
        sharesOwed,
        amountIn,
        restakingToken: restakingToken.id,
        userBalanceAfter,
        timestamp,
        blockNumber,
        tx
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
      gateway,
      poolId,
      underlyingTokens
    } = raw;
    return {
      address,
      symbol,
      name,
      createdTimestamp,
      totalSupply,
      poolId,
      gateway: gateway.id,
      underlyingTokens:
        underlyingTokens?.map(
          ({
            address,
            index,
            strategy,
            weight,
            balance,
            token: { symbol, name, wrapper }
          }) => ({
            address,
            symbol,
            name,
            index,
            strategy,
            weight,
            balance,
            ...(wrapper ? { wrapper: this.toTokenWrapper(wrapper) } : {})
          })
        ) ?? []
    };
  }

  /**
   * Convert a raw `TokenWrapperFieldsFragment` object to a `TokenWrapper`.
   * @param raw The raw `TokenWrapperFieldsFragment` object.
   */
  protected toTokenWrapper(raw: TokenWrapperFieldsFragment): TokenWrapper {
    return {
      address: raw.address,
      wrappedToken: raw.wrappedToken.id,
      unwrappedToken: raw.unwrappedToken.id
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
