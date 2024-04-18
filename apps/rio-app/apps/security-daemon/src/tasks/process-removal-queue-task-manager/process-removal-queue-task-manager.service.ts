import { RioLRTOperatorRegistryABI } from '@rio-app/common/abis/rio-lrt-operator-registry.abi';
import { type RemoveKeysTransaction } from '@internal/db/dist/src/schemas/security';
import { RemovalQueueUtils } from './process-removal-queue-task-manager.utils';
import { SubgraphClient, type LiquidRestakingToken } from '@rionetwork/sdk';
import { and, asc, desc, eq, inArray, isNotNull } from 'drizzle-orm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import {
  decodeFunctionData,
  type PublicClient,
  type Address,
  type Hash,
} from 'viem';
import {
  SecurityDaemonConfigService,
  SecurityDaemonCronTask,
  LoggerService,
  ChainService,
  type CHAIN_ID,
  DatabaseService,
  SecurityDaemonProvider,
  DiscordLoggerService,
} from '@rio-app/common';
import {
  OrderDirection,
  Validator_OrderBy,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';
import { codeBlock } from 'discord.js';

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
    private readonly discordLogger: DiscordLoggerService,
    private readonly utils: RemovalQueueUtils,
  ) {
    this.logger.setContext(this.constructor.name);
    this.discordLogger.register(this.constructor.name);
    this.dbSingleClient = this.databaseService.getSecurityConnection().db;
    this.dbPool = this.databaseService.getSecurityPoolConnection().db;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  /**
   * Process and emit validator key removal transactions in the
   * removal queue
   * @title Process removal queue
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
          const lastBlockNumber =
            await this.utils.getLastTaskBlockNumberIfNotPaused(
              this.dbPool,
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
          const allCurrentAndNextTxs = await this._getCurrentAndNextTxs(
            chainId,
            liquidRestakingToken,
          );

          for await (const [pendingTx, nextQueuedTx] of allCurrentAndNextTxs) {
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
        this.logger.log(`[Finished::${chainId}] Removal queue processed`);
      } catch (error) {
        this.logger.error(`[Error::${chainId}] ${(error as Error).toString()}`);

        await this.discordLogger.sendErrorEmbed('An unforeseen error occured', {
          taskName: 'Processing removal queue',
          description: `An unforeseen error occured while processing the removal queue`,
          chainId,
          code: error.toString(),
        });
      }
    }
  }

  /**
   * This function makes sure the daemon's state is current with onchain state by
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
          this.utils.processRemoveKeyTransactionWithDbTx(
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
      ...operatorIds.map(async (operatorId) => {
        const nextQueuedIdPromise = this.dbPool
          .select({
            removeKeysTransactionId: vk.removeKeysTransactionId,
          })
          .from(vk)
          .leftJoin(rkt, eq(vk.removeKeysTransactionId, rkt.id))
          .where(
            and(
              eq(vk.operatorId, operatorId),
              eq(vk.chainId, chainId),
              eq(vk.operatorRegistryAddress, operatorRegistryAddress),
              isNotNull(vk.removeKeysTransactionId),
              eq(rkt.status, 'queued'),
              isNotNull(rkt.txHash),
            ),
          )
          .orderBy(desc(vk.keyIndex))
          .limit(1)
          .then((results) => results[0]?.removeKeysTransactionId || null);

        return Promise.all([
          this.dbPool
            .select()
            .from(rkt)
            .where(
              and(
                eq(rkt.operatorId, operatorId),
                eq(rkt.chainId, chainId),
                eq(rkt.operatorRegistryAddress, operatorRegistryAddress),
                eq(rkt.status, 'pending'),
                isNotNull(rkt.txHash),
              ),
            )
            .limit(1)
            .then((results) => results[0] || null),

          !(await nextQueuedIdPromise)
            ? Promise.resolve(null)
            : this.dbPool
                .select()
                .from(rkt)
                .where(
                  and(
                    eq(rkt.id, await nextQueuedIdPromise),
                    eq(rkt.status, 'queued'),
                  ),
                )
                .limit(1)
                .then((results) => results[0] || null),
        ]);
      }),
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

      await this.discordLogger.sendWarningEmbed('Removal Tx Reverted', {
        taskName: 'Processing pending transaction',
        description: `Pausing removal queue because of transaction hash: \`${pendingTx.txHash}\``,
        chainId,
        operatorId: pendingTx.operatorId,
        operatorRegistry: pendingTx.operatorRegistryAddress,
      });

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

    await this.dbSingleClient.transaction(async (tx) => {
      return await this.utils.processRemoveKeyTransactionWithDbTx(
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
      );
    });

    return true;
  }

  /**
   * Verifies that the onchain `keyIndices` are correct for the next queued transaction's `validator_keys`
   * using the subgraph and then either emits it or alerts the team if they don't match
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @param {RemoveKeysTransaction} queuedTx The next queued transaction
   */
  private async _emitQueuedTx(
    chainId: CHAIN_ID,
    publicClient: PublicClient, // eslint-disable-line @typescript-eslint/no-unused-vars
    liquidRestakingToken: LiquidRestakingToken,
    subgraph: SubgraphClient,
    queuedTx: RemoveKeysTransaction,
  ) {
    const { operatorId, operatorRegistryAddress } = queuedTx;
    const {
      validatorKeys: vk,
      daemonTaskState: dts,
      removeKeysTransactions: rkt,
    } = this.schema;

    // Fetch the (sequential) `validator_keys` that are linked from the db
    const keysToRemove = await this.dbPool
      .select()
      .from(vk)
      .where(eq(vk.removeKeysTransactionId, queuedTx.id))
      .orderBy(asc(vk.keyIndex));

    // Fetch thee respective key indices from the subgraph
    const onchainKeys = await subgraph.getValidators({
      where: {
        delegator: `${operatorRegistryAddress}-${operatorId}`,
        keyIndex_gte: keysToRemove[0].keyIndex,
        keyIndex_lte: keysToRemove[keysToRemove.length - 1].keyIndex + 1,
      },
      orderBy: Validator_OrderBy.KeyIndex,
      orderDirection: OrderDirection.Asc,
    });

    // Verify that the `key_index` of the keys line up with the keys
    // found on the subgraph
    const matchingKeys = keysToRemove.every((key, index) => {
      return key.keyIndex === Number(onchainKeys[index].keyIndex);
    });

    // If they don't, alert us, pause the queue, and return
    if (!matchingKeys) {
      this.logger.error(
        `[Error::${chainId}::${liquidRestakingToken.symbol}] Key indices do not match for tx: ${queuedTx.txHash}`,
      );

      await this.discordLogger.sendErrorEmbed('Mismatching key indices', {
        taskName: 'Emit queued transaction',
        description: `Pausing removal queue because key indices don't match subgraph for remove_key_transaction.id=\`${queuedTx.id}\``,
        chainId,
        operatorId,
        symbol: liquidRestakingToken.symbol,
        code: JSON.stringify(
          {
            expected: `[${keysToRemove.map((key) => key.keyIndex).join(',')}]`,
            subgraph: `[${onchainKeys.map((key) => key.keyIndex).join(',')}]`,
          },
          null,
          2,
        ),
      });

      await this.dbPool
        .update(dts)
        .set({ status: 'paused' })
        .where(
          and(
            eq(dts.chainId, chainId),
            eq(dts.task, 'key_removal'),
            eq(dts.operatorRegistryAddress, operatorRegistryAddress),
          ),
        );

      return;
    }

    // Emit the transaction, set `status=pending` and the `transaction_hash`

    /**
     * @TODO
     * Emit the transaction and set the transaction hash
     */

    await this.dbPool
      .update(rkt)
      .set({ status: 'pending' })
      .where(eq(rkt.id, queuedTx.id));

    // Log that this needs attention
    this.logger.log(
      `[Info::${chainId}::${liquidRestakingToken.symbol}] Removal needs attention for remove_key_transaction.id: ${queuedTx.id}`,
    );

    await this.discordLogger.sendWarningEmbed('Removal Tx Needs Attention', {
      taskName: 'Emit Queued Transaction',
      description: `A transaction needs to be emitted to remove validatorKeys`,
      chainId,
      symbol: liquidRestakingToken.symbol,
      operatorId: queuedTx.operatorId,
      operatorRegistry: queuedTx.operatorRegistryAddress,
      code: codeBlock(
        'json',
        JSON.stringify(
          {
            'remove_key_transaction.id': queuedTx.id,
            keyIndices: keysToRemove.map((key) => key.keyIndex),
            reason: queuedTx.removalReason,
          },
          null,
          2,
        ),
      ),
    });
  }
}
