import { type RemoveKeysTransaction } from '@internal/db/dist/src/schemas/security';
import { SubgraphClient, type LiquidRestakingToken } from '@rionetwork/sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { type PublicClient } from 'viem';
import { and, eq } from 'drizzle-orm';
import {
  ChainService,
  SecurityDaemonCronTask,
  DatabaseService,
  LoggerService,
  SecurityDaemonConfigService,
  SecurityDaemonProvider,
  CHAIN_ID,
} from '@rio-app/common';

@Injectable()
export class ProcessRemovalQueueTaskManagerService {
  private readonly schema = DatabaseService.securitySchema;
  private readonly db: ReturnType<
    typeof this.databaseService.getSecurityConnection
  >['db'];

  constructor(
    @Inject(SecurityDaemonProvider.CRON_TASK)
    private task: SecurityDaemonCronTask,
    private logger: LoggerService,
    private chain: ChainService,
    private config: SecurityDaemonConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.db = this.databaseService.getSecurityConnection().db;
  }

  /**
   * Check if the task is paused for the given liquid restaking token
   * @param {number} chainId The chain id
   * @param {LiquidRestakingToken} liquidRestakingToken The liquid restaking token
   * @returns {Promise<number | null>} The last blocknumber that was run (or null if paused)
   */
  private async _getLastTaskBlockNumberIfNotPaused(
    chainId: number,
    liquidRestakingToken: LiquidRestakingToken,
  ) {
    const dts = this.schema.daemonTaskState;
    const operatorRegistryAddress =
      liquidRestakingToken.deployment.operatorRegistry;
    const taskStatus = await this.db
      .select({ status: dts.status, lastBlockNumber: dts.lastBlockNumber })
      .from(dts)
      .where(
        and(
          eq(dts.operatorRegistryAddress, operatorRegistryAddress),
          eq(dts.task, 'key_removal'),
        ),
      )
      .then((results) => results[0]);

    if (!taskStatus) {
      await this.db.insert(dts).values({
        chainId,
        operatorRegistryAddress,
        task: 'key_removal',
        status: 'running',
      });
    } else if (taskStatus.status !== 'running') {
      return null;
    }

    return taskStatus.lastBlockNumber ?? 0;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  /**
   * Process and emit validator key removal transactions in the
   * removal queue
   */
  async processRemovalQueue() {
    if (this.task?.chainIds.length === 0) {
      throw new Error(`No chain ids defined for ${this.task.task}`);
    }
    for (const chainId of this.task.chainIds) {
      const subgraphDatasource = this.config.getSubgraphDatasource(chainId);
      const subgraph = new SubgraphClient(subgraphDatasource.chainId, {
        subgraphUrl: subgraphDatasource.url,
        subgraphApiKey: subgraphDatasource.apiKey,
      });

      const liquidRestakingTokens = await subgraph.getLiquidRestakingTokens();
      const publicClient = this.chain.chainClient(chainId);

      try {
        this.logger.log(`[Starting::${chainId}] Processing removal queue`);

        for await (const liquidRestakingToken of liquidRestakingTokens) {
          // Retrieve the task's last task's block from the DB and check if paused
          const lastBlockNumber = await this._getLastTaskBlockNumberIfNotPaused(
            chainId,
            liquidRestakingToken,
          );

          // If the task is paused, skip processing the queue
          if (lastBlockNumber === null) {
            continue;
          }

          // Store common arguments for sub-functions
          const subFxnArgs = [
            chainId,
            publicClient,
            subgraph,
            liquidRestakingToken,
          ] as const;

          // Before processing queue, make sure the daemon's state is current
          // with onchain state by processing any new
          // `OperatorPendingValidatorDetailsRemoved` events that have occured
          // since the last blockNumber (specifically to check for removals not
          // made by us)
          this._syncWithOnchainRemovalEvents(...subFxnArgs, lastBlockNumber);

          // Fetch the next `remove_key_transaction` that's pending with a
          // `transaction_hash` and checks its status:
          const [pendingTx, nextQueuedTx] = await this._getCurrentAndNextTx(
            ...subFxnArgs,
          );

          // Shepherd the current pending transaction by checking its status
          // and processing it accordingly
          let shouldProcessQueuedTx = false;
          if (pendingTx) {
            const pendingTxFinished = await this._processPendingTx(
              ...subFxnArgs,
              pendingTx,
            );
            shouldProcessQueuedTx = pendingTxFinished;
          }

          // If the current pending transaction is finished, emit the next
          // queued transaction
          if (shouldProcessQueuedTx && nextQueuedTx) {
            await this._emitQueuedTx(...subFxnArgs, nextQueuedTx);
          }
        }
        this.logger.log(`[Finished::${chainId}] Processing removal queue`);
      } catch (error) {
        this.logger.error(`[Error::${chainId}] ${(error as Error).toString()}`);
      }
    }
  }

  /**
   * Thie function makes sure the daemon's state is current with onchain state by
   * processing any new `OperatorPendingValidatorDetailsRemoved` events that have occured
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @param {number} lastBlockNumber The last block number
   */
  private async _syncWithOnchainRemovalEvents(
    chainId: CHAIN_ID, // eslint-disable-line @typescript-eslint/no-unused-vars
    publicClient: PublicClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    subgraph: SubgraphClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    liquidRestakingTokens: LiquidRestakingToken, // eslint-disable-line @typescript-eslint/no-unused-vars
    lastBlockNumber: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    /**
     * @TODO
     * If one is found that we don't have any record of scheduling,
     * start a new DB transaction that swaps the last keys' indices
     * with the removed keys before deleting the removed keys.
     */
    /**
     * @TODO
     * Uncomment
     * ---
     * const dts = this.schema.daemonTaskState;
     *
     * const lastBlockNumber =
     *   lastRemovalEvent.blockNumber || (await publicClient.getBlockNumber());
     *
     * await this.db
     *   .update(dts)
     *   .set({ lastBlockNumber })
     *   .where(
     *     and(
     *       eq(dts.operatorRegistryAddress, operatorRegistryAddress),
     *       eq(dts.task, 'key_removal'),
     *     ),
     *   );
     */
  }

  /**
   *
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @returns {Promise<[RemoveKeysTransaction | null, RemoveKeysTransaction | null]>}
   */
  private async _getCurrentAndNextTx(
    chainId: CHAIN_ID, // eslint-disable-line @typescript-eslint/no-unused-vars
    publicClient: PublicClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    subgraph: SubgraphClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    liquidRestakingTokens: LiquidRestakingToken, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<[RemoveKeysTransaction | null, RemoveKeysTransaction | null]> {
    /**
     * @TODO
     * Implement two concurrent queries of the `remove_key_transaction` table:
     * 1. Fetch an existing row that's pending (and has a `transaction_hash`)
     * 2. Fetch the next row that's queued, sorted in descending order by
     *    its linked `validator_key.key_index`.
     */
    return [null, null];
  }

  /**
   *
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @param {RemoveKeysTransaction} pendingTx The pending transaction
   * @returns {Promise<boolean>} True if the task is paused, false otherwise
   */
  private async _processPendingTx(
    chainId: CHAIN_ID, // eslint-disable-line @typescript-eslint/no-unused-vars
    publicClient: PublicClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    subgraph: SubgraphClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    liquidRestakingTokens: LiquidRestakingToken, // eslint-disable-line @typescript-eslint/no-unused-vars
    pendingTx: RemoveKeysTransaction, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    /**
     * @TODO
     * Implement a function that processes a pending `remove_key_transaction`:
     * 1. Fetch the transaction status from the chain. Based on its status:
     *    a. `pending` - sleep.
     *    b. `reverted` - set `status=reverted`, alert us, set
     *       `daemon_state.removal_status = paused`
     *    c. `success` - we start a new DB transaction: set status=succeeded,
     *       set the index of the last key(s) to it the removed keys'
     *       index, then delete the linked `validator_key`s
     * 2. Return a boolean indicating whether the next queued transaction
     *    should be processed.
     */
    return false;
  }

  /**
   *
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @param {RemoveKeysTransaction} queuedTx The next queued transaction
   * @returns
   */
  private async _emitQueuedTx(
    chainId: CHAIN_ID, // eslint-disable-line @typescript-eslint/no-unused-vars
    publicClient: PublicClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    subgraph: SubgraphClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    liquidRestakingTokens: LiquidRestakingToken, // eslint-disable-line @typescript-eslint/no-unused-vars
    queuedTx: RemoveKeysTransaction, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    /**
     * @TODO
     * Implement a function that double-checks the onchain keyIndices of the
     * `validator_keys` linked to the next queued transaction and then emits it:
     * 1. Fetch the (sequential) `validator_keys` that are linked from the db
     * 2. Verify that the `key_index` of the keys line up with the keys
     *    found on the subgraph
     *    a. If they do, emit the transaction, set `status=pending` and the `transaction_hash`
     *    b. If they don't, alert us, and return without
     */
  }
}
