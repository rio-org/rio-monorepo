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
  EstimateOutDepositETHParams
} from '../types';
import {
  LiquidRestakingToken,
  SubgraphClient,
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
    return this._token.coordinator;
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

    this._public = publicClient;
    this._wallet = walletClient;
  }

  /**
   * Get the estimated amount of restaking tokens that will be minted
   * when depositing the specified amount of ETH.
   * @param params The parameters required to query deposit ETH.
   * @returns
   */
  public async getEstimatedOutForETHDeposit(
    params: EstimateOutDepositETHParams
  ): Promise<bigint> {
    if (!this._token) await this.populate();

    const [tvl, totalSupply] = await this._cache.cacheable(
      () =>
        Promise.all([
          this._public.readContract({
            address: this._token.coordinator as ViemAddress,
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
   * @notice Deposits ERC20 tokens and mints liquid restaking tokens to the user.
   * @param params The parameters required to deposit ERC20 tokens.
   */
  public async deposit(
    params: DepositParams
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { tokenIn, amount } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'deposit',
      args: [tokenIn as ViemAddress, BigInt(amount)]
    });
    return this._wallet.writeContract(request);
  }

  /**
   * @notice Deposits ETH and mints liquid restaking tokens to the user.
   * @param params The parameters required to deposit ETH.
   */
  public async depositETH(
    params: DepositETHParams
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { amount } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'depositETH',
      value: BigInt(amount)
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Requests a withdrawal, pulling the specified amount of restaking tokens
   * from the user and queuing a withdrawal to the specified asset.
   * @param params The parameters required to request a withdrawal to ETH
   * or an ERC20 token.
   */
  public async requestWithdrawal(
    params: RequestWithdrawalParams
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { assetOut, amountIn } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'requestWithdrawal',
      args: [assetOut as ViemAddress, BigInt(amountIn)]
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Claims a withdrawal of a single asset in the specified epoch,
   * sending the asset to the user's wallet.
   * @param params The parameters required to claim an ETH or ERC20
   * token withdrawal.
   */
  public async claimWithdrawal(
    params: ClaimWithdrawalParams
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { assetOut, epoch } = params;
    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.coordinator as ViemAddress,
      abi: RioLRTWithdrawalQueueABI,
      functionName: 'claimWithdrawal',
      args: [
        {
          asset: assetOut as ViemAddress,
          epoch: BigInt(epoch)
        }
      ]
    });
    return this._wallet.writeContract(request);
  }

  /**
   * Claims many withdrawals, sending the assets to the user's wallet.
   * of a single asset in the specified epoch,
   * sending the asset to the user's wallet.
   * @param params The parameters required to claim the withdrawal(s).
   */
  public async claimManyWithdrawals(
    params: ClaimWithdrawalParams[]
  ): Promise<WriteContractReturnType> {
    if (!this._wallet) throw new Error('Wallet client is not available.');
    if (!this._token) await this.populate();

    const { request } = await this._public.simulateContract({
      account: this._wallet.account,
      address: this._token.coordinator as ViemAddress,
      abi: RioLRTWithdrawalQueueABI,
      functionName: 'claimManyWithdrawals',
      args: [
        params.map(({ assetOut, epoch }) => ({
          asset: assetOut as ViemAddress,
          epoch: BigInt(epoch)
        }))
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
    this._token.underlyingAssets.forEach(asset => this._underlyingAssets.set(asset.address, asset));
  }
}
