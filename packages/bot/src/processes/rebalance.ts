import {
  ETH_ADDRESS,
  RioLRTCoordinatorABI,
  RioLRTWithdrawalQueueABI,
  ERC20ABI,
  WAD,
  UnderlyingAsset
} from '@rionetwork/sdk';
import {
  GetContractReturnType,
  PublicClient,
  Address as ViemAddress,
  WalletClient,
  getContract
} from 'viem';
import { IProcess, RebalanceProcessConfig } from './types';
import { formatRelative } from 'date-fns';

export class RebalanceProcess implements IProcess {
  /**
   * The number of seconds to wait after an asset can first be rebalanced.
   */
  protected static readonly _BUFFER_SECS = 30;

  /**
   * Whether the rebalance process is currently running.
   */
  protected _isRunning = false;

  /**
   * The rebalance timeouts for each asset.
   */
  protected _rebalanceTimeouts: Record<ViemAddress, NodeJS.Timeout> = {};

  /**
   * The number of seconds to wait between rebalances.
   */
  protected _rebalanceDelay: number | undefined;

  /**
   * The coordinator contract instance.
   */
  protected _coordinator: GetContractReturnType<
    typeof RioLRTCoordinatorABI,
    PublicClient,
    WalletClient
  >;

  /**
   * The withdrawal queue contract instance.
   */
  protected _withdrawalQueue: GetContractReturnType<
    typeof RioLRTWithdrawalQueueABI,
    PublicClient,
    WalletClient
  >;

  /**
   * The underlying token contract instances.
   */
  protected _underlyingTokens: Record<
    ViemAddress,
    GetContractReturnType<typeof ERC20ABI, PublicClient, WalletClient>
  > = {};

  /**
   * @param _config The configuration for the rebalance processs.
   */
  constructor(protected readonly _config: RebalanceProcessConfig) {
    this._coordinator = getContract({
      address: _config.token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      publicClient: _config.publicClient,
      walletClient: _config.walletClient
    });
    this._withdrawalQueue = getContract({
      address: _config.token.deployment.withdrawalQueue as ViemAddress,
      abi: RioLRTWithdrawalQueueABI,
      publicClient: _config.publicClient,
      walletClient: _config.walletClient
    });
  }

  /**
   * Whether the rebalance process is currently running.
   */
  public get isRunning() {
    return this._isRunning;
  }

  /**
   * Get the current unix timestamp in seconds.
   */
  protected get nowSecs() {
    return Math.floor(Date.now() / 1_000);
  }

  /**
   * Start the rebalance process.
   */
  public start() {
    this._isRunning = true;
    this._config.token.underlyingAssets.forEach((asset) =>
      this.scheduleRebalance(asset)
    );
  }

  /**
   * Stop the rebalance process.
   */
  public stop() {
    this._isRunning = false;
    Object.values(this._rebalanceTimeouts).forEach((timeout) =>
      clearTimeout(timeout)
    );
  }

  /**
   * Get the number of seconds until the next rebalance.
   * @param lastRebalancedAt The unix timestamp of the last rebalance.
   */
  protected async getSecondsUntilNextRebalance(lastRebalancedAt: number) {
    this._rebalanceDelay ||= await this._coordinator.read.rebalanceDelay();

    // prettier-ignore
    return Math.max(
      0,
      lastRebalancedAt + this._rebalanceDelay + RebalanceProcess._BUFFER_SECS - this.nowSecs
    );
  }

  /**
   * Schedule rebalances for the given asset.
   * @param asset The asset to schedule rebalances for.
   */
  // prettier-ignore
  protected async scheduleRebalance(asset: UnderlyingAsset): Promise<void> {
    const address = asset.address as ViemAddress;
    const lastRebalancedAt = await this._coordinator.read.assetLastRebalancedAt([address]);
    const nextRebalanceInSecs = await this.getSecondsUntilNextRebalance(Number(lastRebalancedAt));

    const relativeTime = formatRelative(new Date(Date.now() + nextRebalanceInSecs * 1_000), new Date());
    console.log(`Attempting next rebalance of ${asset.symbol} (${this._config.token.symbol}) ${relativeTime}`);

    this._rebalanceTimeouts[address] = setTimeout(async () => {
      if (await this.shouldRebalance(address)) {
        try {
          const hash = await this.rebalance(address);
          console.log(`Rebalanced ${asset.symbol} (${this._config.token.symbol}) in transaction: ${hash}`);
        } catch (error: unknown) {
          console.log(
            `Failed to rebalance ${asset.symbol} (${this._config.token.symbol}) with error: ${(error as Error).message}`
          );
        }

        // Wait 1 minute to reschedule the rebalance, regardless of success.
        setTimeout(() => this.scheduleRebalance(asset), 60 * 1_000);
        return;
      }

      console.log(`Rebalance conditions not met for ${asset.symbol} (${this._config.token.symbol}). Retrying in 5 minutes`);

      // Check again after 5 minutes if no rebalance needed.
      setTimeout(() => this.scheduleRebalance(asset), 5 * 60 * 1000);
    }, nextRebalanceInSecs * 1_000);
  }

  /**
   * Rebalance the given asset.
   * @param assetAddress The address of the asset to rebalance.
   */
  protected async rebalance(assetAddress: ViemAddress): Promise<`0x${string}`> {
    const { request } = await this._config.publicClient.simulateContract({
      account: this._config.walletClient.account,
      address: this._config.token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'rebalance',
      args: [assetAddress]
    });
    return this._config.walletClient.writeContract(request);
  }

  /**
   * Check if the given asset should be rebalanced.
   * @param assetAddress The address of the asset to check.
   */
  // prettier-ignore
  protected async shouldRebalance(asset: ViemAddress): Promise<boolean> {
    const lastRebalancedAt = await this._coordinator.read.assetLastRebalancedAt(
      [asset]
    );

    if ((await this.getSecondsUntilNextRebalance(Number(lastRebalancedAt))) > 0) {
      return false;
    }
    if (await this.canQueueOrSettleWithdrawals(asset)) {
      return true;
    }
    return this.canDeposit(asset);
  }

  /**
   * Check if the withdrawal queue owes shares for the given asset.
   * @param assetAddress The address of the asset to check.
   */
  // prettier-ignore
  protected async canQueueOrSettleWithdrawals(
    assetAddress: ViemAddress
  ): Promise<boolean> {
    const sharesOwed = await this._withdrawalQueue.read.getSharesOwedInCurrentEpoch([assetAddress]);
    return sharesOwed > 0n;
  }

  /**
   * Check if the deposit pool has enough funds to deposit the given asset.
   * @param assetAddress The address of the asset to check.
   */
  protected async canDeposit(assetAddress: ViemAddress): Promise<boolean> {
    // ETH requires a minimum of 32 ETH to be deposited.
    if (assetAddress === ETH_ADDRESS) {
      const balance = await this._config.publicClient.getBalance({
        address: this._config.token.deployment.depositPool as ViemAddress
      });
      return balance >= 32n * WAD;
    }

    const balance = await this.getTokenContract(assetAddress).read.balanceOf([
      this._config.token.deployment.depositPool as ViemAddress
    ]);
    return balance > 0n;
  }

  /**
   * Get the ERC20 token contract for the given address.
   * @param address The address of the token.
   */
  protected getTokenContract(
    address: ViemAddress
  ): GetContractReturnType<typeof ERC20ABI, PublicClient, WalletClient> {
    return (this._underlyingTokens[address] ||= getContract({
      address,
      abi: ERC20ABI,
      publicClient: this._config.publicClient,
      walletClient: this._config.walletClient
    }));
  }
}
