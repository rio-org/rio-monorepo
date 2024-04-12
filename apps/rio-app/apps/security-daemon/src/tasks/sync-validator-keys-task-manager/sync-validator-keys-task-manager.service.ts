import { Inject, Injectable } from '@nestjs/common';
import { LiquidRestakingToken, SubgraphClient } from '@rionetwork/sdk';
import { Cron } from '@nestjs/schedule';
import {
  DatabaseService,
  LoggerService,
  SecurityDaemonConfigService,
  SecurityDaemonProvider,
  SecurityDaemonCronTask,
  ChainService,
  CHAIN_ID,
} from '@rio-app/common';
import { Hash, PublicClient, decodeFunctionData } from 'viem';
import { and, desc, eq, inArray } from 'drizzle-orm';
import {
  OrderDirection,
  Validator_OrderBy,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';
import { RioLRTOperatorRegistryABI } from '@rio-app/common/abis/rio-lrt-operator-registry.abi';
import { RemoveKeysTransaction } from '@internal/db/dist/src/schemas/security';
import {
  KeysToAddLookup,
  TransactionLookup,
} from './sync-validator-keys-task-manager.types';

@Injectable()
export class SyncValidatorKeysTaskManagerService {
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

  // Runs half past the hour every hour
  @Cron('30 0-23/1 * * *')
  /**
   * Retrieves all added validator keys for the past hour and
   * adds ejection requests to the queue for any invalid keys
   */
  async syncValidatorKeys() {
    if (this.task?.chainIds.length === 0) {
      throw new Error(`No chain ids defined for ${this.task.task}`);
    }
    for (const chainId of this.task.chainIds) {
      const subgraphDatasource = this.config.getSubgraphDatasource(chainId);
      const subgraph = new SubgraphClient(subgraphDatasource.chainId, {
        subgraphUrl: subgraphDatasource.url,
        subgraphApiKey: subgraphDatasource.apiKey,
      });

      const publicClient = this.chain.chainClient(chainId);

      const liquidRestakingTokens = await subgraph.getLiquidRestakingTokens();
      try {
        this.logger.log(`[Starting::${chainId}] Syncing added keys...`);
        await this.fetchAllNewValidatorKeysForChain(
          chainId,
          publicClient,
          subgraph,
          liquidRestakingTokens,
        );
        this.logger.log(`[Complete::${chainId}] Finished syncing.`);
      } catch (error) {
        this.logger.error(`[Error::${chainId}] ${(error as Error).toString()}`);
        console.log(error);
      }
    }
  }

  async fetchAllNewValidatorKeysForChain(
    chainId: CHAIN_ID,
    publicClient: PublicClient,
    subgraph: SubgraphClient,
    liquidRestakingTokens: LiquidRestakingToken[],
  ) {
    for (const liquidRestakingToken of liquidRestakingTokens) {
      // Retrieve the task's last task's block from the DB and check if paused
      const lastTaskBlockNumber = await this._getLastTaskBlockNumberIfNotPaused(
        chainId,
        liquidRestakingToken,
      );

      // If the task is paused, skip processing the queue
      if (lastTaskBlockNumber === null) {
        continue;
      }

      const operatorRegistryAddress =
        liquidRestakingToken.deployment.operatorRegistry.toLowerCase();

      const { txLookup, lastBlockNumber } = await this._getAddedValidatorTxs(
        chainId,
        publicClient,
        subgraph,
        liquidRestakingToken,
        operatorRegistryAddress,
      );

      const allKeyTxs = Object.entries(txLookup);

      this.logger.log(
        `[Info::${chainId}::${liquidRestakingToken.symbol}] Found ${allKeyTxs.length} transactions`,
      );

      if (allKeyTxs.length === 0) {
        continue;
      }

      const { keysToAddLookup, keysWithDuplicates } =
        await this._removeDuplicateKeys(
          chainId,
          liquidRestakingToken,
          allKeyTxs,
        );

      /**
       * @TODO Check validity of keys by forking Lido's
       * {@link https://github.com/lidofinance/lido-council-daemon/blob/develop/src/bls/bls.service.ts BLSService}
       */

      /**
       * @TODO Check deposit status of keys
       */

      const keysToRemove = [
        ...keysWithDuplicates,
        // keysWithInvalidSignatures,
        // keysWithDeposits,
      ];

      this.logger.log(
        `[Info::${chainId}::${liquidRestakingToken.symbol}] Found ${
          Object.keys(keysToAddLookup).length
        } valid added keys, ${keysToRemove.length} invalid keys to remove`,
      );

      if (!Object.keys(keysToAddLookup).length && !keysToRemove.length) {
        continue;
      }

      const { removalTxBatches, batchHashLookup } =
        this._getRemovalTransactionBatches(
          chainId,
          operatorRegistryAddress,
          keysToRemove,
        );

      const removalTxBatchesValues = Object.values(removalTxBatches);
      const keysToAdd = Object.values(keysToAddLookup);

      if (
        !allKeyTxs.length &&
        !keysToAdd.length &&
        !removalTxBatchesValues.length
      ) {
        continue;
      }

      const {
        daemonTaskState: dts,
        addKeysTransactions: akt,
        validatorKeys: vk,
        removeKeysTransactions: rkt,
      } = this.schema;

      await this.db.transaction(async (tx) => {
        const addedTxRows = !allKeyTxs.length
          ? []
          : await tx
              .insert(akt)
              .values(
                allKeyTxs.map(([, tx]) => ({
                  chainId,
                  operatorId: tx.operatorId,
                  operatorRegistryAddress,
                  txHash: tx.keyUploadTx,
                  timestamp: new Date(Number(tx.keyUploadTimestamp) * 1000),
                  startIndex: 0,
                  blockNumber: tx.blockNumber,
                })),
              )
              .returning({ id: akt.id, txHash: akt.txHash });

        const removeTxRows = !removalTxBatchesValues.length
          ? []
          : await tx
              .insert(rkt)
              .values(Object.values(removalTxBatches))
              .returning({ id: rkt.id });

        if (!keysToAdd.length && !keysToRemove.length) {
          return;
        }

        await tx.insert(vk).values([
          ...Object.values(keysToAddLookup).map((key) => ({
            chainId,
            operatorId: key.operatorId,
            operatorRegistryAddress,
            publicKey: key.publicKey.replace(/^0x/, ''),
            signature: key.signature.replace(/^0x/, ''),
            keyIndex: key.keyIndex,
            addKeysTransactionId: addedTxRows.find(
              ({ txHash }) => txHash === key.txHash,
            )!.id,
          })),
          ...keysToRemove.map((key) => ({
            chainId,
            operatorId: key.operatorId,
            operatorRegistryAddress,
            publicKey: key.publicKey.replace(/^0x/, ''),
            signature: key.signature.replace(/^0x/, ''),
            keyIndex: key.keyIndex,
            addKeysTransactionId: addedTxRows.find(
              ({ txHash }) => txHash === key.txHash,
            )!.id,
            removeKeysTransactionId:
              removeTxRows[batchHashLookup[`${key.operatorId}-${key.keyIndex}`]]
                .id,
          })),
        ]);

        if (lastBlockNumber > lastTaskBlockNumber) {
          await tx
            .update(dts)
            .set({ lastBlockNumber })
            .where(
              and(
                eq(dts.operatorRegistryAddress, operatorRegistryAddress),
                eq(dts.task, 'key_retrieval'),
              ),
            );
        }
      });
    }
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
    const { daemonTaskState: dts, addKeysTransactions: akt } = this.schema;
    const operatorRegistryAddress =
      liquidRestakingToken.deployment.operatorRegistry;
    const taskStatus = await this.db
      .select({ status: dts.status, lastBlockNumber: dts.lastBlockNumber })
      .from(dts)
      .where(
        and(
          eq(dts.operatorRegistryAddress, operatorRegistryAddress),
          eq(dts.task, 'key_retrieval'),
        ),
      )
      .then((results) => results[0]);

    if (!taskStatus) {
      await this.db.insert(dts).values({
        chainId,
        operatorRegistryAddress,
        task: 'key_retrieval',
        status: 'running',
      });
    } else if (taskStatus.status !== 'running') {
      return null;
    }

    return taskStatus.lastBlockNumber ?? 0;
  }

  /**
   *
   * @param {number} chainId The chain id
   * @param {PublicClient} publicClient The public client
   * @param {SubgraphClient} subgraph The subgraph client
   * @param {LiquidRestakingToken} liquidRestakingTokens The liquid restaking token
   * @param {string} operatorRegistryAddress The operator registry address
   */
  private async _getAddedValidatorTxs(
    chainId: CHAIN_ID,
    publicClient: PublicClient,
    subgraph: SubgraphClient,
    liquidRestakingToken: LiquidRestakingToken,
    operatorRegistryAddress: string,
  ) {
    const akt = this.schema.addKeysTransactions;

    let lastTimestamp = await this.db
      .select({ timestamp: akt.timestamp })
      .from(akt)
      .where(
        and(
          eq(akt.operatorRegistryAddress, operatorRegistryAddress),
          eq(akt.chainId, chainId),
        ),
      )
      .orderBy(desc(akt.blockNumber))
      .then((results) => {
        const d = results[0]?.timestamp;
        return d ? Math.floor(d.valueOf() / 1000) : undefined;
      });

    const txLookup: TransactionLookup = {};
    const txLookupErrors: { [keyUploadTx: string]: Error } = {};

    lastTimestamp ??= Number(liquidRestakingToken.createdTimestamp);
    const perPage = 200;
    let [finished, page] = [false, 1];
    let lastBlockNumber = 0;

    while (!finished) {
      const validators = await subgraph.getValidators({
        where: { keyUploadTimestamp_gt: lastTimestamp },
        orderBy: Validator_OrderBy.KeyUploadTimestamp,
        orderDirection: OrderDirection.Asc,
        page: page++,
        perPage,
      });

      for await (const validator of validators) {
        const { keyIndex, keyUploadTx, keyUploadTimestamp } = validator;

        if (!txLookup[keyUploadTx]) {
          const tx = await publicClient.getTransaction({
            hash: keyUploadTx as Hash,
          });

          if (!tx) {
            this.logger.error(
              `[Error::${chainId}::${liquidRestakingToken.symbol}] Transaction not found: ${keyUploadTx}`,
            );
            txLookupErrors[keyUploadTx] = new Error('Transaction not found');
            continue;
          }

          lastBlockNumber = Number(tx.blockNumber);

          const { functionName, args } = decodeFunctionData({
            abi: RioLRTOperatorRegistryABI,
            data: tx.input,
          });

          if (functionName !== 'addValidatorDetails') {
            this.logger.error(
              `[Error::${chainId}::${liquidRestakingToken.symbol}] Transaction not \`addValidatorDetails\`: ${keyUploadTx}`,
            );
          }

          const [operatorId, , pubkeysBuffer, signaturesBuffer] =
            args as unknown as [number, number, `0x${string}`, `0x${string}`];
          const pubkeysArr = pubkeysBuffer.slice(2).match(/.{1,96}/g);
          const signaturesArr = signaturesBuffer.slice(2).match(/.{1,192}/g);

          if (!pubkeysArr || pubkeysArr?.length !== signaturesArr?.length) {
            this.logger.error(
              `[Error::${chainId}::${liquidRestakingToken.symbol}] Invalid key lengths: hash=${tx.hash}pubkeys=${pubkeysArr.length} signatures=${signaturesArr.length}`,
            );
          }

          const signaturesByKeys: (typeof txLookup)[string]['signaturesByKeys'] =
            {};
          for (let i = 0; i < pubkeysArr.length; i++) {
            signaturesByKeys[pubkeysArr[i]] = signaturesArr[i];
          }

          txLookup[keyUploadTx] = {
            operatorId,
            keyUploadTx,
            keyUploadTimestamp,
            signaturesByKeys,
            blockNumber: Number(tx.blockNumber),
            keys: {},
          };
        }

        if (txLookupErrors[keyUploadTx]) {
          continue;
        }

        const publicKey = validator.publicKey.slice(2);
        const signature =
          txLookup[keyUploadTx].signaturesByKeys[publicKey].slice(2);
        txLookup[keyUploadTx].keys[keyIndex] = {
          publicKey,
          signature,
        };
      }

      if (validators.length < perPage) {
        finished = true;
        continue;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return { txLookup, lastBlockNumber };
  }

  async _removeDuplicateKeys(
    chainId: CHAIN_ID,
    liquidRestakingToken: LiquidRestakingToken,
    allKeyTxs: [string, TransactionLookup[string]][],
  ) {
    const { validatorKeys: vk } = this.schema;
    const keysToAddLookup: KeysToAddLookup = {};

    const keysWithDuplicates: (KeysToAddLookup[string] & {
      removalReason: RemoveKeysTransaction['removalReason'];
    })[] = [];

    for await (const [txHash, txData] of allKeyTxs) {
      const keyEntries = Object.entries(txData.keys);
      for await (const [keyIndex, keys] of keyEntries) {
        if (keysToAddLookup[keys.publicKey]) {
          this.logger.error(
            `[Alert::${chainId}::${liquidRestakingToken.symbol}] Duplicate key: ${keys.publicKey}`,
          );
          keysWithDuplicates.push({
            txHash,
            ...keys,
            keyIndex: Number(keyIndex),
            operatorId: txData.operatorId,
            removalReason: 'duplicate',
          });
          continue;
        }
        keysToAddLookup[keys.publicKey] = {
          txHash,
          ...keys,
          keyIndex: Number(keyIndex),
          operatorId: txData.operatorId,
        };
      }
    }

    const keysToDuplicateCheck = Object.keys(keysToAddLookup);
    const duplicateKeys = await Promise.all(
      [...Array(Math.ceil(keysToDuplicateCheck.length / 200))].map((_, i) =>
        this.db
          .select({ publicKey: vk.publicKey })
          .from(vk)
          .where(
            and(
              eq(vk.chainId, chainId),
              inArray(
                vk.publicKey,
                keysToDuplicateCheck.slice(i * 100, (i + 1) * 100),
              ),
            ),
          ),
      ),
    );

    duplicateKeys.flat().map(({ publicKey }) => {
      keysWithDuplicates.push({
        ...keysToAddLookup[publicKey],
        removalReason: 'duplicate',
      });
      delete keysToAddLookup[publicKey];
    });

    return { keysToAddLookup, keysWithDuplicates };
  }

  private _getRemovalTransactionBatches(
    chainId: CHAIN_ID,
    operatorRegistryAddress: string,
    keysToRemove: (KeysToAddLookup[string] & {
      removalReason: RemoveKeysTransaction['removalReason'];
    })[],
  ) {
    const { removeKeysTransactions: rkt } = this.schema;
    let batchCount = 0;
    const removalTxBatches: {
      [batchNumber: number]: typeof rkt.$inferInsert;
    } = {};
    const batchHashLookup: { [operatorIdDashKeyIndex: string]: number } = {};
    keysToRemove.forEach((keyToRemove) => {
      const { operatorId, keyIndex, removalReason } = keyToRemove;
      const batchNumber =
        batchHashLookup[`${operatorId}-${keyIndex - 1}`] ?? batchCount++;
      batchHashLookup[`${operatorId}-${keyIndex}`] = batchNumber;
      if (!removalTxBatches[batchNumber]) {
        removalTxBatches[batchNumber] = {
          chainId,
          operatorId,
          operatorRegistryAddress,
          removalReason,
          status: 'queued',
        };
      }
    });

    return { removalTxBatches, batchHashLookup };
  }
}
