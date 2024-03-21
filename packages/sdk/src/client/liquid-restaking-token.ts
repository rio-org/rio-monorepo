import {
  PublicClient,
  WalletClient,
  WriteContractReturnType,
  Address as ViemAddress
} from 'viem';
import {
  Address,
  DepositETHParams,
  DepositParams,
  RequestWithdrawalParams,
  ClaimWithdrawalParams,
  EstimateOutDepositETHParams,
  EstimateOutRequestWithdrawalParams,
  TxOverrides
} from '../types';
import {
  LiquidRestakingToken,
  SubgraphClient,
  SubgraphClientOptions,
  UnderlyingAsset
} from '../subgraph';
import {
  ERC20ABI,
  RioLRTCoordinatorABI,
  RioLRTWithdrawalQueueABI
} from '../abi';
import { Cacheables } from 'cacheables';

export class LiquidRestakingTokenClient {
  private readonly _address: Address;
  private readonly _subgraph: SubgraphClient;
  private readonly _cache = new Cacheables();

  private _public: PublicClient;
  private _wallet: WalletClient | undefined;
  private _token: LiquidRestakingToken;
  private _underlyingAssets = new Map<string, UnderlyingAsset>();

  /**
   * General information about the liquid restaking token.
   */
  public get token() {
    return this._token;
  }

  /**
   * The address that must be approved to spend ERC20 tokens on behalf of the user
   * prior to deposit.
   */
  public get allowanceTarget() {
    return this._token.deployment.coordinator;
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
   * the underlying asset information. It will be populated lazily.
   * @param address The address of the restaking token issued by Rio.
   * @param publicClient The public client used to read data.
   * @param walletClient The optional wallet client used to write data.
   * @param subgraphUrl An optional subgraph URL to use instead of the default.
   */
  constructor(
    address: Address,
    publicClient: PublicClient,
    walletClient?: WalletClient,
    subgraphClientOptions?: SubgraphClientOptions
  ) {
    this._address = address;

    if (!publicClient.chain?.id) {
      throw new Error(
        'Chain ID is not available in the public client provided to `LiquidRestakingToken`.'
      );
    }
    this._subgraph = new SubgraphClient(
      publicClient.chain.id,
      subgraphClientOptions
    );

    this._public = publicClient;
    this._wallet = walletClient;
  }

  /**
   * Get the estimated amount of restaking tokens that will be minted
   * when depositing the specified amount of ETH.
   * @param params The parameters required to get the estimated output amount.
   */
  public async getEstimatedOutForETHDeposit(
    params: EstimateOutDepositETHParams
  ): Promise<bigint> {
    if (!this._token) await this.populate();

    const [tvl, totalSupply] = await this._cache.cacheable(
      () =>
        Promise.all([
          this._public.readContract({
            address: this._token.deployment.coordinator as ViemAddress,
            abi: RioLRTCoordinatorABI,
            functionName: 'getTVL'
          }),
          this._public.readContract({
            address: this._token.address as ViemAddress,
            abi: ERC20ABI,
            functionName: 'totalSupply'
          })
        ]),
      'estimate-eth-inputs',
      {
        cachePolicy: 'max-age',
        maxAge: 10_000 // Cache for 10 seconds
      }
    );
    if (tvl === 0n || totalSupply === 0n) return BigInt(params.amount);

    return (BigInt(params.amount) * totalSupply) / tvl;
  }

  /**
   * Get the estimated quantity of the output asset expected to be received
   * upon initiating a withdrawal of a specified quantity of restaking tokens.
   * @param params The parameters required to get the estimated output amount.
   */
  public async getEstimatedOutForWithdrawalRequest(
    params: EstimateOutRequestWithdrawalParams
  ): Promise<bigint> {
    if (!this._token) await this.populate();
    return this._public.readContract({
      address: this._token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'convertToAssetFromRestakingTokens',
      args: [params.assetOut as ViemAddress, BigInt(params.amountIn)]
    });
  }

  /**
   * @notice Deposits ERC20 tokens and mints liquid restaking tokens to the user.
   * @param params The parameters required to deposit ERC20 tokens.
   * @param overrides Optional transaction overrides.
   */
  public async deposit(
    params: DepositParams,
    overrides?: TxOverrides
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { tokenIn, amount } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'deposit',
      args: [tokenIn as ViemAddress, BigInt(amount)],
      ...overrides
    });
    return this._wallet.writeContract(request);
  }

  /**
   * @notice Deposits ETH and mints liquid restaking tokens to the user.
   * @param params The parameters required to deposit ETH.
   * @param overrides Optional transaction overrides.
   */
  public async depositETH(
    params: DepositETHParams,
    overrides?: TxOverrides
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { amount } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'depositETH',
      value: BigInt(amount),
      ...overrides
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Requests a withdrawal, pulling the specified amount of restaking tokens
   * from the user and queuing a withdrawal to the specified asset.
   * @param params The parameters required to request a withdrawal to ETH
   * or an ERC20 token.
   * @param overrides Optional transaction overrides.
   */
  public async requestWithdrawal(
    params: RequestWithdrawalParams,
    overrides?: TxOverrides
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { assetOut, amountIn } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'requestWithdrawal',
      args: [assetOut as ViemAddress, BigInt(amountIn)],
      ...overrides
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Claims the full amount of the asset owed to the caller in the
   * specified epoch.
   * @param params The parameters required to claim an ETH or ERC20
   * token withdrawal.
   * @param overrides Optional transaction overrides.
   */
  public async claimWithdrawalsForEpoch(
    params: ClaimWithdrawalParams,
    overrides?: TxOverrides
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { assetOut, epoch } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.deployment.withdrawalQueue as ViemAddress,
      abi: RioLRTWithdrawalQueueABI,
      functionName: 'claimWithdrawalsForEpoch',
      args: [
        {
          asset: assetOut as ViemAddress,
          epoch: BigInt(epoch)
        }
      ],
      ...overrides
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Claims the full amount(s) of the asset(s) owed to the caller in the
   * specified epoch(s).
   * @param params The parameters required to claim the withdrawal(s).
   * @param overrides Optional transaction overrides.
   */
  public async claimWithdrawalsForManyEpochs(
    params: ClaimWithdrawalParams[],
    overrides?: TxOverrides
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.deployment.withdrawalQueue as ViemAddress,
      abi: RioLRTWithdrawalQueueABI,
      functionName: 'claimWithdrawalsForManyEpochs',
      args: [
        params.map(({ assetOut, epoch }) => ({
          asset: assetOut as ViemAddress,
          epoch: BigInt(epoch)
        }))
      ],
      ...overrides
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Populates the restaking and underlying token information.
   */
  // prettier-ignore
  public async populate() {
    this._token = await this._subgraph.getLiquidRestakingToken(this._address);
    this._token.underlyingAssets.forEach(asset => this._underlyingAssets.set(asset.address, asset));
  }
}
