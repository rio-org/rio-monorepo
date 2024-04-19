import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { formatDistance } from 'date-fns';
import {
  ETH_ADDRESS,
  RioLRTCoordinatorABI,
  RioLRTWithdrawalQueueABI,
  ERC20ABI,
  WAD,
  UnderlyingAsset,
} from '@rionetwork/sdk';
import {
  GetContractReturnType,
  Client,
  Address as ViemAddress,
  getContract,
  createPublicClient,
  createWalletClient,
  http,
  Chain,
  WalletClient,
  PublicClient,
  Account,
  HttpTransport,
} from 'viem';
import { LoggerService, RebalancerBotConfig } from '@rio-app/common';
import { privateKeyToAccount } from 'viem/accounts';
import { goerli, holesky, mainnet } from 'viem/chains';

@Injectable()
export class TokenRebalancerService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  /**
   * The number of seconds to wait after an asset can first be rebalanced.
   */
  protected static readonly _BUFFER_SECS = 30;

  /**
   * The rebalancer-token timeouts for each asset.
   */
  protected _rebalanceTimeouts: Record<ViemAddress, NodeJS.Timeout> = {};

  /**
   * The coordinator contract instance.
   */
  protected _coordinator: any;

  /**
   * The withdrawal queue contract instance.
   */
  protected _withdrawalQueue: any;

  /**
   * The underlying token contract instances.
   */
  protected _underlyingTokens: Record<
    ViemAddress,
    GetContractReturnType<typeof ERC20ABI>
  > = {};

  protected walletClient: WalletClient;
  protected publicClient: PublicClient<HttpTransport, Chain, Account>;

  protected supportedChains: Record<number, Chain> = {
    1: mainnet,
    5: goerli,
    17000: holesky,
  };

  constructor(
    private logger: LoggerService,
    private bot: RebalancerBotConfig,
    private serviceName: string,
  ) {
    this.logger.setContext(serviceName);
    const { chainId, privateKey, token } = bot;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.publicClient = createPublicClient({
      chain:
        this.supportedChains[chainId] ||
        (() => {
          throw new Error('Invalid chain ID');
        })(),
      transport: http(),
    });

    const account = privateKeyToAccount(privateKey);
    this.walletClient = createWalletClient({
      chain: this.publicClient.chain,
      transport: http(),
      account,
    });

    this._coordinator = getContract({
      address: token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      client: { public: this.publicClient as Client },
    });
    this._withdrawalQueue = getContract({
      address: token.deployment.withdrawalQueue as ViemAddress,
      abi: RioLRTWithdrawalQueueABI,
      client: { public: this.publicClient as Client },
    });
  }

  /**
   * Get the current unix timestamp in seconds.
   */
  protected get nowSecs() {
    return Math.floor(Date.now() / 1_000);
  }

  /**
   * Start the rebalancer-token process.
   */
  public onApplicationBootstrap() {
    this.logger.log(
      `Starting rebalancer bot for chainId:${this.bot.chainId} and token:${this.bot.token.name}`,
    );
    this.bot.token.underlyingAssets.forEach((asset) =>
      this.scheduleRebalance(asset),
    );
  }

  /**
   * Stop the rebalancer-token process.
   */
  public onModuleDestroy() {
    Object.values(this._rebalanceTimeouts).forEach((timeout) =>
      clearTimeout(timeout),
    );
  }

  /**
   * Get the number of seconds until the next rebalancer-token.
   * @param nextRebalanceAfter The unix timestamp at which the next rebalancer-token can occur.
   */
  protected getSecondsUntilNextRebalance(nextRebalanceAfter: bigint) {
    // prettier-ignore
    return Math.max(
      0,
      parseInt(nextRebalanceAfter.toString(), 10) + TokenRebalancerService._BUFFER_SECS - this.nowSecs
    );
  }

  /**
   * Schedule rebalances for the given asset.
   * @param asset The asset to schedule rebalances for.
   */
  //prettier-ignore
  protected async scheduleRebalance(asset: UnderlyingAsset): Promise<void> {
    const address = asset.address as ViemAddress;
    const nextRebalanceAfter = await this._coordinator.read.assetNextRebalanceAfter([address]);
    const nextRebalanceInSecs = this.getSecondsUntilNextRebalance(nextRebalanceAfter);
    const nextRebalanceInMs = nextRebalanceInSecs * 1_000;
    const relativeTime = formatDistance(
      new Date(Date.now() + nextRebalanceInMs),
      new Date(),
      { addSuffix: true },
    );

    this.logger.log(
      `Attempting next rebalance of ${asset.symbol} (${this.bot.token.symbol}) ${nextRebalanceInMs ? relativeTime : 'now'}`,
    );

    this._rebalanceTimeouts[address] = setTimeout(async () => {
      if (await this.shouldRebalance(address)) {
        try {
          const hash = await this.rebalance(address);
          this.logger.log(`Rebalanced ${asset.symbol} (${this.bot.token.symbol}) in transaction: ${hash}`,);
        } catch (error: unknown) {
          this.logger.error(`Failed to rebalance ${asset.symbol} (${this.bot.token.symbol}) with error: ${(error as Error).message}`,);
        }

        // Wait 1 minute to reschedule the rebalancer-token, regardless of success.
        setTimeout(() => this.scheduleRebalance(asset), 60 * 1_000);
        return;
      }

      this.logger.log(`Rebalance conditions not met for ${asset.symbol} (${this.bot.token.symbol}). Retrying in 5 minutes`,);

      // Check again after 5 minutes if no rebalancer-token needed.
      setTimeout(() => this.scheduleRebalance(asset), 5 * 60 * 1000);
    }, nextRebalanceInMs);
  }

  /**
   * Rebalance the given asset.
   * @param assetAddress The address of the asset to rebalancer-token.
   */
  protected async rebalance(assetAddress: ViemAddress): Promise<`0x${string}`> {
    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.bot.token.deployment.coordinator as ViemAddress,
      abi: RioLRTCoordinatorABI,
      functionName: 'rebalance',
      args: [assetAddress],
    });
    return this.walletClient.writeContract(request);
  }

  /**
   * Check if the given asset should be rebalanced.
   * @param asset The address of the asset to check.
   */
  // prettier-ignore
  protected async shouldRebalance(asset: ViemAddress): Promise<boolean> {
    const nextRebalanceAfter = await this._coordinator.read.assetNextRebalanceAfter(
      [asset]
    );

    if (this.getSecondsUntilNextRebalance(nextRebalanceAfter) > 0) {
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
    assetAddress: ViemAddress,
  ): Promise<boolean> {
    const sharesOwed = await this._withdrawalQueue.read.getSharesOwedInCurrentEpoch([assetAddress,]);
    return sharesOwed > 0n;
  }

  /**
   * Check if the deposit pool has enough funds to deposit the given asset.
   * @param assetAddress The address of the asset to check.
   */
  protected async canDeposit(assetAddress: ViemAddress): Promise<boolean> {
    // ETH requires a minimum of 32 ETH to be deposited.
    if (assetAddress === ETH_ADDRESS) {
      const balance = await this.publicClient.getBalance({
        address: this.bot.token.deployment.depositPool as ViemAddress,
      });
      return balance >= 32n * WAD;
    }

    const balance = await this.getTokenContract(assetAddress).read.balanceOf([
      this.bot.token.deployment.depositPool as ViemAddress,
    ]);
    return balance > 0n;
  }

  /**
   * Get the ERC20 token contract for the given address.
   * @param address The address of the token.
   */
  protected getTokenContract(address: ViemAddress): any {
    return (this._underlyingTokens[address] ||= getContract({
      address,
      abi: ERC20ABI,
      client: { public: this.publicClient as Client },
    }));
  }
}
