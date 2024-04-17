import { type LiquidRestakingToken } from '@rionetwork/sdk';
import { type PgTransaction } from 'drizzle-orm/pg-core';
import { Injectable } from '@nestjs/common';
import { type Address } from 'viem';
import {
  type PostgresJsDatabase,
  type PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js';
import {
  type ExtractTablesWithRelations,
  securitySchema,
  and,
  desc,
  eq,
  gte,
  lt,
} from '@internal/db';
import { DiscordLoggerService } from '@rio-app/common';

@Injectable()
export class RemovalQueueUtils {
  constructor(private readonly discordLogger: DiscordLoggerService) {
    this.discordLogger.register(this.constructor.name);
  }

  /**
   * Get the status of the task for the given liquid restaking token
   * @param {number} chainId The chain id
   * @param {LiquidRestakingToken} liquidRestakingToken The liquid restaking token
   * @param {'key_removal' | 'key_retrieval'} taskName The task name
   * @returns {Promise<Pick<DaemonTaskState, 'lastBlockNumber' | 'status'>>} The last blocknumber that was run (or null if paused)
   */
  async getTaskStatus(
    db: PostgresJsDatabase<typeof securitySchema>,
    chainId: number,
    liquidRestakingToken: LiquidRestakingToken,
    taskName: 'key_removal' | 'key_retrieval',
  ) {
    const dts = securitySchema.daemonTaskState;
    const operatorRegistryAddress =
      liquidRestakingToken.deployment.operatorRegistry;
    return await db
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

  async processRemoveKeyTransactionWithDbTx(
    tx: PgTransaction<
      PostgresJsQueryResultHKT,
      typeof securitySchema,
      ExtractTablesWithRelations<typeof securitySchema>
    >,
    operatorId: number,
    chainId: number,
    operatorRegistryAddress: Address,
    fromIndex: bigint,
    validatorCount: bigint,
  ) {
    const { validatorKeys: vk, removeKeysTransactions: rkt } = securitySchema;
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
  async getLastTaskBlockNumberIfNotPaused(
    db: PostgresJsDatabase<typeof securitySchema>,
    chainId: number,
    liquidRestakingToken: LiquidRestakingToken,
  ) {
    const dts = securitySchema.daemonTaskState;
    const operatorRegistryAddress =
      liquidRestakingToken.deployment.operatorRegistry;
    const taskStatus = await this.getTaskStatus(
      db,
      chainId,
      liquidRestakingToken,
      'key_removal',
    );

    if (!taskStatus) {
      await db.insert(dts).values({
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
}
