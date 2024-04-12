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
  type ValidatorKeysByPubKey,
  type TransactionInformationByHash,
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
        for (const liquidRestakingToken of liquidRestakingTokens) {
          await this.fetchAllNewValidatorKeysForLrt(
            chainId,
            publicClient,
            subgraph,
            liquidRestakingToken,
          );
        }
        this.logger.log(`[Complete::${chainId}] Finished syncing.`);
      } catch (error) {
        this.logger.error(`[Error::${chainId}] ${(error as Error).toString()}`);
        console.log(error);
      }
    }
  }

  async fetchAllNewValidatorKeysForLrt(
    chainId: CHAIN_ID,
    publicClient: PublicClient,
    subgraph: SubgraphClient,
    liquidRestakingToken: LiquidRestakingToken,
  ) {
    // Retrieve the task's last task's block from the DB and check if paused
    const lastTaskBlockNumber = await this._getLastTaskBlockNumberIfNotPaused(
      chainId,
      liquidRestakingToken,
    );

    // If the task is paused, skip processing the queue
    if (lastTaskBlockNumber === null) {
      return;
    }

    const operatorRegistryAddress =
      liquidRestakingToken.deployment.operatorRegistry.toLowerCase();

    // Retrieve all the added validator keys since last run and
    // store them in a dictionary by transaction hash
    const { txInfoByHash, lastBlockNumber } = await this._getAddedValidatorTxs(
      chainId,
      publicClient,
      subgraph,
      liquidRestakingToken,
      operatorRegistryAddress,
    );

    // Convert the dictionary to an array of key information
    const addKeyTxs = Object.values(txInfoByHash);

    this.logger.log(
      `[Info::${chainId}::${liquidRestakingToken.symbol}] Found ${addKeyTxs.length} transactions`,
    );

    // If no keys were found, return
    if (addKeyTxs.length === 0) {
      return;
    }

    // Dictionary of AddKeyTransaction rows accessed by public key
    // - Items are removed from this as they are added to the key removal arrays
    const validatorKeysByPubKey: ValidatorKeysByPubKey = {};

    // Remove duplicate keys from the dictionary and return the keys that were removed
    const { keysWithDuplicates } = await this._removeDuplicateKeys(
      chainId,
      liquidRestakingToken,
      validatorKeysByPubKey,
      addKeyTxs,
    );

    /**
     * @TODO
     * Check validity of keys by forking Lido's
     * {@link https://github.com/lidofinance/lido-council-daemon/blob/develop/src/bls/bls.service.ts BLSService}
     * Then remove keys from `validatorKeysByPubKey` and return an array of keys that were removed
     */

    /**
     * @TODO Check deposit status of keys
     * Then remove keys from `validatorKeysByPubKey` and return an array of keys that were removed
     */

    // Obtain the keys to be added
    const keysToAdd = Object.values(validatorKeysByPubKey);

    // Combine all removed keys into a single array
    const keysToRemove = [
      ...keysWithDuplicates,
      // keysWithInvalidSignatures,
      // keysWithDeposits,
    ];

    this.logger.log(
      `[Info::${chainId}::${liquidRestakingToken.symbol}] Found ${
        Object.keys(validatorKeysByPubKey).length
      } valid added keys, ${keysToRemove.length} invalid keys to remove`,
    );

    // Create removal transactions for the invalid keys
    // and batch sequential keys into the same transaction
    const { removalTxBatches, batchHashLookup } =
      this._getRemovalTransactionBatches(
        chainId,
        operatorRegistryAddress,
        keysToRemove,
      );

    // Insert all transactions and keys into the database
    await this.db.transaction(async (tx) => {
      const {
        daemonTaskState: dts,
        addKeysTransactions: akt,
        validatorKeys: vk,
        removeKeysTransactions: rkt,
      } = this.schema;

      const addKeyTxRows = !addKeyTxs.length
        ? []
        : await tx
            .insert(akt)
            .values(
              addKeyTxs.map((tx) => ({
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

      const removalTxBatchesValues = Object.values(removalTxBatches);
      const removeTxRows = !removalTxBatchesValues.length
        ? []
        : await tx
            .insert(rkt)
            .values(removalTxBatchesValues)
            .returning({ id: rkt.id });

      if (keysToAdd.length || keysToRemove.length) {
        await tx.insert(vk).values([
          ...Object.values(validatorKeysByPubKey).map((key) => ({
            chainId,
            operatorId: key.operatorId,
            operatorRegistryAddress,
            publicKey: key.publicKey.replace(/^0x/, ''),
            signature: key.signature.replace(/^0x/, ''),
            keyIndex: key.keyIndex,
            addKeysTransactionId: addKeyTxRows.find(
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
            addKeysTransactionId: addKeyTxRows.find(
              ({ txHash }) => txHash === key.txHash,
            )!.id,
            removeKeysTransactionId:
              removeTxRows[batchHashLookup[`${key.operatorId}-${key.keyIndex}`]]
                .id,
          })),
        ]);
      }

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
    const { daemonTaskState: dts } = this.schema;
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

    const txInfoByHash: TransactionInformationByHash = {};
    const txInfoByHashErrors: { [keyUploadTx: string]: Error } = {};

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

        if (!txInfoByHash[keyUploadTx]) {
          const tx = await publicClient.getTransaction({
            hash: keyUploadTx as Hash,
          });

          if (!tx) {
            this.logger.error(
              `[Error::${chainId}::${liquidRestakingToken.symbol}] Transaction not found: ${keyUploadTx}`,
            );
            txInfoByHashErrors[keyUploadTx] = new Error(
              'Transaction not found',
            );
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

          const signaturesByKeys: (typeof txInfoByHash)[string]['signaturesByKeys'] =
            {};
          for (let i = 0; i < pubkeysArr.length; i++) {
            signaturesByKeys[pubkeysArr[i]] = signaturesArr[i];
          }

          txInfoByHash[keyUploadTx] = {
            operatorId,
            keyUploadTx,
            keyUploadTimestamp,
            signaturesByKeys,
            blockNumber: Number(tx.blockNumber),
            keys: {},
          };
        }

        if (txInfoByHashErrors[keyUploadTx]) {
          continue;
        }

        const publicKey = validator.publicKey.slice(2);
        const signature =
          txInfoByHash[keyUploadTx].signaturesByKeys[publicKey].slice(2);
        txInfoByHash[keyUploadTx].keys[keyIndex] = {
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

    return { txInfoByHash, lastBlockNumber };
  }

  async _removeDuplicateKeys(
    chainId: CHAIN_ID,
    liquidRestakingToken: LiquidRestakingToken,
    validatorKeysByPubKey: ValidatorKeysByPubKey,
    addKeyTxs: TransactionInformationByHash[string][],
  ) {
    const { validatorKeys: vk } = this.schema;

    const keysWithDuplicates: (ValidatorKeysByPubKey[string] & {
      removalReason: RemoveKeysTransaction['removalReason'];
    })[] = [];

    for await (const txData of addKeyTxs) {
      const keyEntries = Object.entries(txData.keys);
      for await (const [keyIndex, keys] of keyEntries) {
        if (validatorKeysByPubKey[keys.publicKey]) {
          this.logger.error(
            `[Alert::${chainId}::${liquidRestakingToken.symbol}] Duplicate key: ${keys.publicKey}`,
          );
          keysWithDuplicates.push({
            txHash: txData.keyUploadTx,
            ...keys,
            keyIndex: Number(keyIndex),
            operatorId: txData.operatorId,
            removalReason: 'duplicate',
          });
          continue;
        }
        validatorKeysByPubKey[keys.publicKey] = {
          txHash: txData.keyUploadTx,
          ...keys,
          keyIndex: Number(keyIndex),
          operatorId: txData.operatorId,
        };
      }
    }

    const keysToDuplicateCheck = Object.keys(validatorKeysByPubKey);
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
        ...validatorKeysByPubKey[publicKey],
        removalReason: 'duplicate',
      });
      delete validatorKeysByPubKey[publicKey];
    });

    return { keysWithDuplicates };
  }

  private _getRemovalTransactionBatches(
    chainId: CHAIN_ID,
    operatorRegistryAddress: string,
    keysToRemove: (ValidatorKeysByPubKey[string] & {
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
