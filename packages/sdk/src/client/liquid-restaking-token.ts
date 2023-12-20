import {
  BALANCER_HELPERS_ADDRESS,
  WeightedPoolJoinKind,
  subtractSlippage,
  toPoolAddress
} from '../utils';
import { BalancerHelpersABI, RioLRTGatewayABI, TokenWrapperABI } from '../abi';
import {
  PublicClient,
  WalletClient,
  WriteContractReturnType,
  Address as ViemAddress,
  zeroAddress,
  encodeAbiParameters
} from 'viem';
import {
  Address,
  InputTokenExactIn,
  JoinTokensExactInParams,
  OutputTokenMinOut,
  QueryJoinTokensExactInParams,
  QueryExitTokenExactInParams,
  ExitTokenExactInParams
} from '../types';
import {
  LiquidRestakingToken,
  SubgraphClient,
  TokenWrapper,
  UnderlyingToken
} from '../subgraph';
import { WeightedPoolExitKind } from '../utils/balancer';

export class LiquidRestakingTokenClient {
  private readonly _address: Address;
  private readonly _subgraph: SubgraphClient;
  private readonly _balancerHelpers: ViemAddress;

  private _public: PublicClient;
  private _wallet: WalletClient | undefined;
  private _token: LiquidRestakingToken;
  private _underlyingTokens = new Map<string, UnderlyingToken>();
  private _tokenIndices = new Map<string, number>();
  private _tokenWrappers = new Map<string, TokenWrapper>();

  /**
   * General information about the liquid restaking token.
   */
  public get token() {
    return this._token;
  }

  /**
   * The address that must be approved to spend tokens on behalf of the user
   * prior to join/exit.
   */
  public get allowanceTarget() {
    return this._token.gateway;
  }

  /**
   * Create an new instance of the `LiquidRestakingTokenClient` class and populate
   * the underlying token information.
   * @param address The address of the restaking token issued by Rio.
   * @param publicClient The public client used to read data.
   * @param walletClient The optional wallet client used to write data.
   */
  public static async create(
    address: Address,
    publicClient: PublicClient,
    walletClient?: WalletClient
  ) {
    const client = new LiquidRestakingTokenClient(
      address,
      publicClient,
      walletClient
    );
    await client.populate();

    return client;
  }

  /**
   * Attach the `LiquidRestakingTokenClient` instance to a new public client.
   * @param publicClient The new public client.
   */
  public attachPublicClient(publicClient: PublicClient) {
    this._public = publicClient;

    return this;
  }

  /**
   * Attach the `LiquidRestakingTokenClient` instance to a new wallet client.
   * @param walletClient The new wallet client.
   */
  public attachWalletClient(walletClient?: WalletClient) {
    this._wallet = walletClient;

    return this;
  }

  /**
   * Create a new instance of the `LiquidRestakingTokenClient` class without populating
   * the underlying token information. It will be populated lazily.
   * @param address The address of the restaking token issued by Rio.
   * @param publicClient The public client used to read data.
   * @param walletClient The optional wallet client used to write data.
   */
  constructor(
    address: Address,
    publicClient: PublicClient,
    walletClient?: WalletClient
  ) {
    this._address = address;

    if (!publicClient.chain?.id) {
      throw new Error(
        'Chain ID is not available in the public client provided to `LiquidRestakingToken`.'
      );
    }
    this._subgraph = new SubgraphClient(publicClient.chain.id);
    this._balancerHelpers = BALANCER_HELPERS_ADDRESS[publicClient.chain.id];

    this._public = publicClient;
    this._wallet = walletClient;
  }

  /**
   * @notice Queries the pool with the exact amounts of the provided tokens,
   * and returns the estimated amount of LRT that would be minted, applying
   * the provided slippage factor.
   * @param params The parameters required to query for a join with exact token amounts.
   */
  public async queryJoinTokensExactIn(
    params: QueryJoinTokensExactInParams
  ): Promise<JoinTokensExactInParams> {
    if (!this._token) await this.populate();

    const queryInputs: { tokensIn: InputTokenExactIn[] } = {
      tokensIn: [
        {
          address: toPoolAddress(this._token.poolId),
          amount: BigInt(0)
        }
      ]
    };
    const output: JoinTokensExactInParams = {
      tokensIn: [],
      minAmountOut: BigInt(-1)
    };

    // Add all underlying tokens to the query inputs and function output.
    for (const token of this._token.underlyingTokens) {
      // The tokens in the response do not contain BPT, so we subtract 1 from the index.
      output.tokensIn[token.index - 1] = {
        address: token.address,
        amount: '0'
      };
      queryInputs.tokensIn[token.index] = {
        address: token.address,
        amount: '0'
      };
    }

    // Convert tokens to pool tokens, if needed.
    for (const token of params.tokensIn) {
      const address = token.address.toLowerCase();
      const index = this._tokenIndices.get(address);
      if (!index) {
        throw new Error(`Cannot determine index for token: ${address}`);
      }

      // Populate the input tokens in the response.
      output.tokensIn[index - 1] = token;

      // If the token is in the list of underlying pool tokens, no wrapping is needed.
      const underlying = this._underlyingTokens.get(address);
      if (underlying) {
        queryInputs.tokensIn[underlying.index] = {
          address: underlying.address,
          amount: BigInt(token.amount)
        };
        continue;
      }

      {
        // Otherwise, we must wrap the provided token.
        const wrapper = this._tokenWrappers.get(address);
        if (!wrapper) {
          throw new Error(`Unknown token: ${address}`);
        }
        const underlying = this._underlyingTokens.get(wrapper.wrappedToken)!;

        output.tokensIn[index - 1].requiresWrap = true;
        queryInputs.tokensIn[underlying.index] = {
          address: wrapper.wrappedToken,
          amount: await this._public.readContract({
            address: wrapper.address as ViemAddress,
            abi: TokenWrapperABI,
            functionName: 'getWrappedForUnwrapped',
            args: [BigInt(token.amount)]
          })
        };
      }
    }

    const join = await this._public.simulateContract({
      address: this._balancerHelpers,
      abi: BalancerHelpersABI,
      functionName: 'queryJoin',
      args: [
        this._token.poolId as ViemAddress,
        this._token.gateway as ViemAddress,
        this._token.gateway as ViemAddress,
        {
          assets: queryInputs.tokensIn.map(
            (token) => token.address as ViemAddress
          ),
          maxAmountsIn: queryInputs.tokensIn.map((token) =>
            BigInt(token.amount)
          ),
          userData: encodeAbiParameters(
            [{ type: 'uint256' }, { type: 'uint256[]' }, { type: 'uint256' }],
            [
              BigInt(WeightedPoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT),
              queryInputs.tokensIn.slice(1).map(({ amount }) => BigInt(amount)),
              BigInt(0) /* minimum BPT */
            ]
          ),
          fromInternalBalance: false
        }
      ]
    });
    const bptOut = BigInt(join.result[0]);

    return {
      ...output,
      minAmountOut: subtractSlippage(bptOut, BigInt(params.slippage))
    };
  }

  /**
   * @notice Queries the pool with an exact amount of LRT, and returns the estimated
   * amount of the provided token that would be received, applying the provided
   * slippage factor.
   * @param params The parameters required to query for an exit to a single output token
   * with an exact amount of LRT.
   */
  public async queryRequestExitTokenExactIn(
    params: QueryExitTokenExactInParams
  ) {
    if (!this._token) await this.populate();

    const queryInputs: { tokensOut: OutputTokenMinOut[] } = {
      tokensOut: [
        {
          address: toPoolAddress(this._token.poolId),
          minAmount: BigInt(0)
        }
      ]
    };
    const output: ExitTokenExactInParams = {
      amountIn: params.amountIn,
      tokenOut: {
        address: params.tokenOut,
        minAmount: BigInt(-1),
        requiresUnwrap: false
      }
    };

    // Add all underlying tokens to the query input function.
    for (const token of this._token.underlyingTokens) {
      queryInputs.tokensOut[token.index] = {
        address: token.address,
        minAmount: BigInt(0)
      };
    }

    // Convert the token to a pool token, if needed.
    const address = params.tokenOut.toLowerCase();
    const index = this._tokenIndices.get(address);
    if (!index) {
      throw new Error(`Cannot determine index for token: ${address}`);
    }

    // If the output token is not in the list of underlying tokens, then we must provide the wrapped
    // version and unwrap it after querying for the exit.
    const underlying = this._underlyingTokens.get(address);
    if (!underlying) {
      const wrapper = this._tokenWrappers.get(address);
      if (!wrapper) {
        throw new Error(`Unknown token: ${address}`);
      }
      output.tokenOut.requiresUnwrap = true;
      queryInputs.tokensOut[index].address = wrapper.wrappedToken;
    }

    const exit = await this._public.simulateContract({
      address: this._balancerHelpers,
      abi: BalancerHelpersABI,
      functionName: 'queryExit',
      args: [
        this._token.poolId as ViemAddress,
        this._token.gateway as ViemAddress,
        this._token.gateway as ViemAddress,
        {
          assets: queryInputs.tokensOut.map(
            (token) => token.address as ViemAddress
          ),
          minAmountsOut: queryInputs.tokensOut.map(() => BigInt(0)),
          userData: encodeAbiParameters(
            [{ type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }],
            [
              BigInt(WeightedPoolExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT),
              BigInt(params.amountIn),
              BigInt(index - 1) /* Pool Token Index without BPT */
            ]
          ),
          toInternalBalance: false
        }
      ]
    });

    let tokenOut = BigInt(exit.result[1][index]);
    if (output.tokenOut.requiresUnwrap) {
      const wrapper = this._tokenWrappers.get(address)!;
      tokenOut = await this._public.readContract({
        address: wrapper.address as ViemAddress,
        abi: TokenWrapperABI,
        functionName: 'getUnwrappedForWrapped',
        args: [tokenOut]
      });
    }
    output.tokenOut.minAmount = subtractSlippage(
      tokenOut,
      BigInt(params.slippage)
    );

    return output;
  }

  /**
   * @notice Joins the pool with the exact amounts of the provided tokens,
   * and mints an estimated but unknown (computed at run time) amount of LRT.
   * @param params The parameters required to join with exact token amounts.
   */
  public async joinTokensExactIn(
    params: JoinTokensExactInParams
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { tokensIn, minAmountOut } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.gateway as ViemAddress,
      abi: RioLRTGatewayABI,
      functionName: 'joinTokensExactIn',
      args: [
        {
          tokensIn: tokensIn.map((token) => token.address as ViemAddress),
          amountsIn: tokensIn.map((token) => BigInt(token.amount)),
          requiresWrap: tokensIn.map((token) => token.requiresWrap ?? false),
          minAmountOut: BigInt(minAmountOut)
        }
      ],
      value: BigInt(
        tokensIn.find((token) => token.address === zeroAddress)?.amount ?? 0
      )
    });
    return this._wallet.writeContract(request);
  }

  /**
   * @notice Requests an exit to an estimated but unknown (computed at run time)
   * amount of a single token, and burns an exact amount of LRT.
   * @param params The parameters required to exit to a single output token
   * with an exact amount of LRT.
   */
  public async requestExitTokenExactIn(
    params: ExitTokenExactInParams
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { amountIn, tokenOut } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.gateway as ViemAddress,
      abi: RioLRTGatewayABI,
      functionName: 'requestExitTokenExactIn',
      args: [
        {
          tokenOut: tokenOut.address as ViemAddress,
          minAmountOut: BigInt(tokenOut.minAmount),
          requiresUnwrap: tokenOut.requiresUnwrap ?? false,
          amountIn: BigInt(amountIn)
        }
      ]
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Populates the restaking and underlying token information.
   */
  // prettier-ignore
  public async populate() {
    this._token = await this._subgraph.getLiquidRestakingToken(this._address);

    for (const token of this._token.underlyingTokens) {
      // Populate the underlying token mapping.
      this._underlyingTokens.set(token.address, token);
      if (token.symbol === 'WETH') {
        this._underlyingTokens.set(zeroAddress, token);
        this._tokenIndices.set(zeroAddress, token.index);
      }      

      // Populate the token indices and wrappers (with reverse lookups).
      this._tokenIndices.set(token.address, token.index);
      if (token.wrapper) {
        this._tokenIndices.set(token.wrapper.unwrappedToken, token.index);

        this._tokenWrappers.set(token.wrapper.wrappedToken, token.wrapper);
        this._tokenWrappers.set(token.wrapper.unwrappedToken, token.wrapper);
      }
    }
  }
}
