import { type RemoveKeysTransaction } from '@internal/db/dist/src/schemas/security';
import { SubgraphClient, type LiquidRestakingToken } from '@rionetwork/sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { Address, decodeFunctionData, Hash, type PublicClient } from 'viem';
import { RioLRTOperatorRegistryABI } from '@rio-app/common/abis/rio-lrt-operator-registry.abi';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { PgTransaction } from 'drizzle-orm/pg-core';
import {
  ExtractTablesWithRelations,
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  lt,
} from 'drizzle-orm';
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
  private readonly dbSingleClient: ReturnType<
    typeof this.databaseService.getSecurityConnection
  >['db'];
  private readonly dbPool: ReturnType<
    typeof this.databaseService.getSecurityPoolConnection
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
    this.dbSingleClient = this.databaseService.getSecurityConnection().db;
    this.dbPool = this.databaseService.getSecurityPoolConnection().db;
  }

  /**
   * Get the status of the task for the given liquid restaking token
   * @param {number} chainId The chain id
   * @param {LiquidRestakingToken} liquidRestakingToken The liquid restaking token
   * @param {'key_removal' | 'key_retrieval'} taskName The task name
   * @returns {Promise<Pick<DaemonTaskState, 'lastBlockNumber' | 'status'>>} The last blocknumber that was run (or null if paused)
   */
  private async _getTaskStatus(
    chainId: number,
    liquidRestakingToken: LiquidRestakingToken,
    taskName: 'key_removal' | 'key_retrieval',
  ) {
    const dts = this.schema.daemonTaskState;
    const operatorRegistryAddress =
      liquidRestakingToken.deployment.operatorRegistry;
    return await this.dbPool
      .select({ status: dts.status, lastBlockNumber: dts.lastBlockNumber })
      .from(dts)
      .where(
        and(
          eq(dts.chainId, chainId),
          eq(dts.operatorRegistryAddress, operatorRegistryAddress),
          eq(dts.task, taskName),
        ),
      )
      .then((results) => results[0]);
  }

  private async _processRemoveKeyTransactionWithDbTx(
    tx: PgTransaction<
      PostgresJsQueryResultHKT,
      typeof this.schema,
      ExtractTablesWithRelations<typeof this.schema>
    >,
    operatorId: number,
    chainId: number,
    operatorRegistryAddress: Address,
    fromIndex: bigint,
    validatorCount: bigint,
  ) {
    const { validatorKeys: vk, removeKeysTransactions: rkt } = this.schema;
    const sharedWhereAndArr = [
      eq(vk.operatorId, operatorId),
      eq(vk.chainId, chainId),
      eq(vk.operatorRegistryAddress, operatorRegistryAddress),
    ];

    const linkedRemoveTxIdsPromise = tx
      .delete(vk)
      .where(
        and(
          ...sharedWhereAndArr,

          gte(vk.keyIndex, Number(fromIndex)),
          lt(vk.keyIndex, Number(fromIndex + validatorCount)),
        ),
      )
      .returning({
        keyIndex: vk.keyIndex,
        removeKeysTransactionId: vk.removeKeysTransactionId,
      })
      .then((r) => r.sort((a, b) => a.keyIndex - b.keyIndex));

    const keysNeedingIndicesReplacedPromise = tx
      .select({ id: vk.id })
      .from(vk)
      .where(
        and(
          ...sharedWhereAndArr,
          gte(vk.keyIndex, Number(fromIndex + validatorCount)),
        ),
      )
      .orderBy(desc(vk.keyIndex))
      .limit((await linkedRemoveTxIdsPromise).length);

    const linkedRemoveTxIds = await linkedRemoveTxIdsPromise;
    const keysNeedingIndicesReplaced = await keysNeedingIndicesReplacedPromise;

    await Promise.all(
      linkedRemoveTxIds.map(
        async ({ keyIndex, removeKeysTransactionId }, i) => {
          const swapKeyIndex = !keysNeedingIndicesReplaced[i]
            ? Promise.resolve([])
            : tx
                .update(vk)
                .set({ keyIndex })
                .where(eq(vk.id, keysNeedingIndicesReplaced[i].id));

          const removeKeysTransactionIdUpdate = !removeKeysTransactionId
            ? Promise.resolve([])
            : tx
                .update(rkt)
                .set({ status: 'succeeded' })
                .where(eq(rkt.id, removeKeysTransactionId));

          return await Promise.all([
            swapKeyIndex,
            removeKeysTransactionIdUpdate,
          ]);
        },
      ),
    );
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
    const taskStatus = await this._getTaskStatus(
      chainId,
      liquidRestakingToken,
      'key_removal',
    );

    if (!taskStatus) {
      await this.dbSingleClient.insert(dts).values({
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

          // Before processing queue, make sure the daemon's state is current
          // with onchain state by processing any new
          // `OperatorPendingValidatorDetailsRemoved` events that have occured
          // since the last blockNumber (specifically to check for removals not
          // made by us)
          await this._syncWithOnchainRemovalEvents(
            chainId,
            publicClient,
            liquidRestakingToken,
            lastBlockNumber,
          );

          // Fetch the next `remove_key_transaction` that's pending with a
          // `transaction_hash` and checks its status:
          const currentAndNextTxsForOperators =
            await this._getCurrentAndNextTxs(chainId, liquidRestakingToken);

          for await (const currentAndNextTx of currentAndNextTxsForOperators) {
            const [pendingTx, nextQueuedTx] = currentAndNextTx;

            // Shepherd the current pending transaction by checking its status
            // and processing it accordingly
            const shouldProcessQueuedTx =
              !!pendingTx &&
              (await this._processPendingTx(
                chainId,
                publicClient,
                liquidRestakingToken,
                pendingTx,
              ));

            // If the current pending transaction is finished, emit the next
            // queued transaction
            if (shouldProcessQueuedTx && nextQueuedTx) {
              await this._emitQueuedTx(
                chainId,
                publicClient,
                liquidRestakingToken,
                subgraph,
                nextQueuedTx,
              );
            }
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
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @param {number} lastBlockNumber The last block number
   */
  private async _syncWithOnchainRemovalEvents(
    chainId: CHAIN_ID,
    publicClient: PublicClient,
    liquidRestakingTokens: LiquidRestakingToken,
    lastBlockNumber: number,
  ) {
    const operatorRegistryAddress = liquidRestakingTokens.deployment
      .operatorRegistry as Address;
    const currentBlock = await publicClient.getBlockNumber();

    const { validatorKeys: vk, daemonTaskState: dts } = this.schema;
    const { keyIndex } = vk;

    let blockNumber = lastBlockNumber;
    let newLastBlockNumber = Number(currentBlock);
    let finished = false;
    const allLogs: [number, bigint, bigint][] = [];

    while (blockNumber < currentBlock && !finished) {
      const toBlock = Math.min(blockNumber + 50000, Number(currentBlock));
      const logs = await publicClient.getContractEvents({
        abi: RioLRTOperatorRegistryABI,
        address: operatorRegistryAddress,
        eventName: 'OperatorPendingValidatorDetailsRemoved',
        fromBlock: BigInt(blockNumber + 1),
        toBlock: BigInt(toBlock),
      });

      for await (const log of logs) {
        const tx = await publicClient.getTransaction({
          hash: log.transactionHash,
        });

        const { functionName, args } = decodeFunctionData({
          abi: RioLRTOperatorRegistryABI,
          data: tx.input,
        });

        if (functionName !== 'removeValidatorDetails') {
          this.logger.error(
            `Unexpected function name: ${functionName} for tx: ${log.transactionHash}`,
          );

          /**
           * @todo
           * Should this pause the task and alert us?
           */

          continue;
        }

        const [operatorId, fromIndex, validatorCount] =
          args as (typeof allLogs)[number];

        const lastRecordedKeyIndex = await this.dbPool
          .select({ keyIndex })
          .from(vk)
          .where(
            and(
              eq(vk.operatorId, operatorId),
              eq(vk.chainId, chainId),
              eq(vk.operatorRegistryAddress, operatorRegistryAddress),
            ),
          )
          .limit(1)
          .then((results) => results[0]?.keyIndex);

        const maxKeyToRemove = fromIndex + validatorCount - 1n;
        if (lastRecordedKeyIndex && lastRecordedKeyIndex < maxKeyToRemove) {
          newLastBlockNumber = Number(tx.blockNumber) - 1;
          finished = true;
          break;
        }

        allLogs.push([operatorId, fromIndex, validatorCount]);
      }

      blockNumber = toBlock;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await this.dbSingleClient.transaction(async (tx) => {
      await Promise.all([
        ...allLogs.map(([operatorId, fromIndex, validatorCount]) =>
          this._processRemoveKeyTransactionWithDbTx(
            tx,
            operatorId,
            chainId,
            operatorRegistryAddress,
            fromIndex,
            validatorCount,
          ),
        ),
        tx
          .update(dts)
          .set({ lastBlockNumber: newLastBlockNumber })
          .where(
            and(
              eq(dts.chainId, chainId),
              eq(dts.operatorRegistryAddress, operatorRegistryAddress),
              eq(dts.task, 'key_removal'),
            ),
          ),
      ]);
    });
  }

  /**
   *
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @returns {Promise<[RemoveKeysTransaction | null, RemoveKeysTransaction | null]>}
   */
  private async _getCurrentAndNextTxs(
    chainId: CHAIN_ID,
    liquidRestakingTokens: LiquidRestakingToken,
  ): Promise<[RemoveKeysTransaction | null, RemoveKeysTransaction | null][]> {
    const { validatorKeys: vk, removeKeysTransactions: rkt } = this.schema;
    const operatorRegistryAddress = liquidRestakingTokens.deployment
      .operatorRegistry as Address;

    const result: Promise<
      [RemoveKeysTransaction | null, RemoveKeysTransaction | null]
    >[] = [];

    const operatorIds = await this.dbPool
      .selectDistinct({ operatorId: rkt.operatorId })
      .from(rkt)
      .where(
        and(
          eq(rkt.chainId, chainId),
          eq(rkt.operatorRegistryAddress, operatorRegistryAddress),
          inArray(rkt.status, ['pending', 'queued']),
        ),
      )
      .then((results) => results.map((result) => result.operatorId));

    return await Promise.all([
      ...operatorIds.map(async (operatorId) =>
        Promise.all([
          this.dbPool
            .select()
            .from(rkt)
            .where(
              and(
                eq(rkt.operatorId, operatorId),
                eq(rkt.chainId, chainId),
                eq(rkt.operatorRegistryAddress, operatorRegistryAddress),
                eq(rkt.status, 'pending'),
              ),
            )
            .limit(1)
            .then(
              (results) => results[0] || null,
            ) as Promise<RemoveKeysTransaction | null>,
          this.dbPool
            .select({ removeKeyTransaction: rkt })
            .from(vk)
            .leftJoin(
              rkt,
              and(
                eq(vk.operatorId, operatorId),
                eq(vk.chainId, chainId),
                eq(vk.operatorRegistryAddress, operatorRegistryAddress),
                isNotNull(vk.removeKeysTransactionId),
                eq(vk.removeKeysTransactionId, rkt.id),
              ),
            )
            .where(eq(rkt.status, 'queued'))
            .orderBy(desc(vk.keyIndex))
            .limit(1)
            .then(
              (results) => results[0]?.removeKeyTransaction || null,
            ) as Promise<RemoveKeysTransaction | null>,
        ]),
      ),
    ]);
  }

  /**
   * A function that processes a pending `remove_key_transaction`:
   * 1. Fetch the transaction status from the chain. Based on its status:
   *    a. `pending` - sleep.
   *    b. `reverted` - set `status=reverted`, alert us, set
   *       `daemon_state.removal_status = paused`
   *    c. `success` - we start a new DB transaction: set status=succeeded,
   *       set the index of the last key(s) to it the removed keys'
   *       index, then delete the linked `validator_key`s
   * 2. Return a boolean indicating whether the next queued transaction
   *    should be processed.
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingToken The liquid restaking token
   * @param {RemoveKeysTransaction} pendingTx The pending transaction
   * @returns {Promise<boolean>} True if the transaction has succeeded, false otherwise
   */
  private async _processPendingTx(
    chainId: CHAIN_ID,
    publicClient: PublicClient,
    liquidRestakingToken: LiquidRestakingToken,
    pendingTx: RemoveKeysTransaction,
  ) {
    // Fetch the transaction status from the chain.
    const args = { hash: pendingTx.txHash as Hash };
    const [txReceipt, confirmations] = await Promise.all([
      publicClient.getTransactionReceipt(args),
      publicClient.getTransactionConfirmations(args),
    ]);

    // `pending`
    // - sleep.
    if (!confirmations) {
      this.logger.log(
        `[Info::${chainId}::${liquidRestakingToken.symbol}] Pending tx: ${pendingTx.txHash} is still pending`,
      );

      return false;
    }

    // `reverted`
    // - alert us
    // - set `remove_key_transaction.status = reverted`
    // - set `daemon_state.status = paused`
    if (txReceipt.status === 'reverted') {
      const { removeKeysTransactions: rkt, daemonTaskState: dts } = this.schema;

      this.logger.error(
        `[Error::${chainId}::${liquidRestakingToken.symbol}] Tx: ${pendingTx.txHash} reverted`,
      );

      await this.dbSingleClient.transaction(async (tx) => {
        return Promise.all([
          tx
            .update(rkt)
            .set({ status: 'reverted' })
            .where(eq(rkt, pendingTx.id)),
          tx
            .update(dts)
            .set({ status: 'paused' })
            .where(
              and(
                eq(dts.chainId, chainId),
                eq(dts.task, 'key_removal'),
                eq(
                  dts.operatorRegistryAddress,
                  liquidRestakingToken.deployment.operatorRegistry,
                ),
              ),
            ),
        ]);
      });

      return false;
    }

    // `success` - we start a new DB transaction:
    //  - set status=succeeded,
    //  - set the index of the last key(s) to it the removed keys' index
    //  - delete the linked `validator_key`s
    const { validatorKeys: vk } = this.schema;
    const keyIndices = await this.dbPool
      .select({ keyIndex: vk.keyIndex })
      .from(vk)
      .where(eq(vk.removeKeysTransactionId, pendingTx.id))
      .orderBy(asc(vk.keyIndex));

    await this.dbSingleClient.transaction(
      async (tx) =>
        await this._processRemoveKeyTransactionWithDbTx(
          tx,
          pendingTx.operatorId,
          chainId,
          liquidRestakingToken.deployment.operatorRegistry as Address,
          BigInt(keyIndices[0].keyIndex),
          BigInt(
            1 +
              (keyIndices[keyIndices.length - 1].keyIndex -
                keyIndices[0].keyIndex),
          ),
        ),
    );

    return true;
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
    liquidRestakingTokens: LiquidRestakingToken, // eslint-disable-line @typescript-eslint/no-unused-vars
    subgraph: SubgraphClient, // eslint-disable-line @typescript-eslint/no-unused-vars
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
