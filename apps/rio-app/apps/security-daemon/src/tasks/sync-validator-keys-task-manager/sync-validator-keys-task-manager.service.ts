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
import { Address, Hash, PublicClient, decodeFunctionData } from 'viem';
import { and, desc, eq, inArray } from 'drizzle-orm';
import {
  OrderDirection,
  Validator_OrderBy,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';
import { RioLRTOperatorRegistryABI } from '@rio-app/common/abis/rio-lrt-operator-registry.abi';
import {
  type ValidatorKeysByPubKey,
  type TransactionInformationByHash,
  ValidatorKeyToBeRemoved,
  AddedValidatorKeyTxInformation,
  AddedValidatorKey,
} from './sync-validator-keys-task-manager.types';
import { SyncValidatorKeysUtils } from './sync-validator-keys-task-manager.utils';

@Injectable()
export class SyncValidatorKeysTaskManagerService {
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
    private readonly utils: SyncValidatorKeysUtils,
  ) {
    this.logger.setContext(this.constructor.name);
    this.dbSingleClient = this.databaseService.getSecurityConnection().db;
    this.dbPool = this.databaseService.getSecurityPoolConnection().db;
  }

  // Runs half past the hour every hour
  @Cron('34 0-23/1 * * *')
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
    const { addKeyTxs, lastBlockNumber } = await this._getAddedValidatorTxs(
      chainId,
      publicClient,
      subgraph,
      liquidRestakingToken,
      operatorRegistryAddress,
    );

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
    const keysWithDuplicates = await this._removeDuplicateKeys(
      chainId,
      liquidRestakingToken,
      validatorKeysByPubKey,
      addKeyTxs,
    );

    // Remove keys with invalid signatures from the dictionary and return the keys that were removed
    const keysWithInvalidSignatures =
      await this._removeKeysWithInvalidSignatures(
        chainId,
        validatorKeysByPubKey,
      );

    // // Remove keys with deposits from the dictionary and return the keys that were removed
    // const keysWithDeposits = await this._removeKeysWithDeposits(
    //   chainId,
    //   liquidRestakingToken,
    //   validatorKeysByPubKey,
    //   publicClient,
    // );

    // Obtain the keys to be added
    const keysToAdd = Object.values(validatorKeysByPubKey);

    // Combine all removed keys into a single array
    const keysToRemove = [
      ...keysWithDuplicates,
      ...keysWithInvalidSignatures,
      // ...keysWithDeposits,
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
    await this.dbSingleClient.transaction(async (tx) => {
      const commonArgs = [chainId, operatorRegistryAddress] as const;
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
              this._formatAddKeyTxDbInserts(
                chainId,
                operatorRegistryAddress,
                addKeyTxs,
              ),
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
        await tx
          .insert(vk)
          .values(
            this._formatKeysDbInserts(
              ...commonArgs,
              [...keysToAdd, ...keysToRemove],
              addKeyTxRows,
              removeTxRows,
              batchHashLookup,
            ),
          );
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

  private _formatAddKeyTxDbInserts(
    chainId: CHAIN_ID,
    operatorRegistryAddress: string,
    addKeyTxs: AddedValidatorKeyTxInformation[],
  ) {
    return addKeyTxs.map((tx) => ({
      chainId,
      operatorId: tx.operatorId,
      operatorRegistryAddress,
      txHash: tx.keyUploadTx,
      timestamp: new Date(Number(tx.keyUploadTimestamp) * 1000),
      startIndex: 0,
      blockNumber: tx.blockNumber,
    }));
  }

  private _formatKeysDbInserts(
    chainId: CHAIN_ID,
    operatorRegistryAddress: string,
    keysToRemove: AddedValidatorKey[],
    addKeyTxRows: { id: string; txHash: string }[],
    removeTxRows: { id: string }[],
    batchHashLookup: { [operatorIdDashKeyIndex: string]: number },
  ) {
    return keysToRemove.map((key) => ({
      chainId,
      operatorId: key.operatorId,
      operatorRegistryAddress,
      publicKey: key.publicKey.replace(/^0x/, ''),
      signature: key.signature.replace(/^0x/, ''),
      keyIndex: key.keyIndex,
      addKeysTransactionId: addKeyTxRows.find(
        ({ txHash }) => txHash === key.txHash,
      )!.id,
      removeKeysTransactionId: !key.removalReason
        ? undefined
        : removeTxRows[batchHashLookup[`${key.operatorId}-${key.keyIndex}`]].id,
    }));
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
    const taskStatus = await this.dbPool
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
      await this.dbSingleClient.insert(dts).values({
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

    let lastTimestamp = await this.dbPool
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

    // Convert the dictionary to an array of key information
    const addKeyTxs = Object.values(txInfoByHash);

    return { addKeyTxs, lastBlockNumber };
  }

  async _removeDuplicateKeys(
    chainId: CHAIN_ID,
    liquidRestakingToken: LiquidRestakingToken,
    validatorKeysByPubKey: ValidatorKeysByPubKey,
    addKeyTxs: AddedValidatorKeyTxInformation[],
  ) {
    const { validatorKeys: vk } = this.schema;

    const keysWithDuplicates: ValidatorKeyToBeRemoved[] = [];

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
        this.dbPool
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

    duplicateKeys.flat().forEach(({ publicKey }) => {
      keysWithDuplicates.push({
        ...validatorKeysByPubKey[publicKey],
        removalReason: 'duplicate',
      });
      delete validatorKeysByPubKey[publicKey];
    });

    return keysWithDuplicates;
  }

  private async _removeKeysWithInvalidSignatures(
    chainId: CHAIN_ID,
    validatorKeysByPubKey: ValidatorKeysByPubKey,
  ) {
    const validatorKeys = Object.values(validatorKeysByPubKey);
    const keysWithInvalidSignatures: AddedValidatorKey[] = [];
    const pages = [...Array(Math.ceil(validatorKeys.length / 100))].map(
      (_, i) => i,
    );

    for await (const page of pages) {
      const keysToRemove = await this.utils.verifyDepositsAreValid(
        chainId,
        validatorKeys.slice(page * 100, (page + 1) * 100),
      );
      keysWithInvalidSignatures.push(...keysToRemove);
    }

    return keysWithInvalidSignatures.map((key) => {
      delete validatorKeysByPubKey[key.publicKey];
      return {
        ...key,
        removalReason: 'invalid_signature',
      } as ValidatorKeyToBeRemoved;
    });
  }

  private async _removeKeysWithDeposits(
    chainId: CHAIN_ID,
    liquidRestakingToken: LiquidRestakingToken,
    validatorKeysByPubKey: ValidatorKeysByPubKey,
    publicClient: PublicClient,
  ) {
    const validatorKeys = Object.values(validatorKeysByPubKey);
    const keysWithDeposits: AddedValidatorKey[] = [];
    const pages = [...Array(Math.ceil(validatorKeys.length / 100))].map(
      (_, i) => i,
    );

    for await (const page of pages) {
      const keysToRemove = await this.utils.verifyValidatorKeysAreUnused(
        chainId,
        liquidRestakingToken.deployment.coordinator as Address,
        validatorKeys.slice(page * 100, (page + 1) * 100),
        publicClient,
      );
      keysWithDeposits.push(...keysToRemove);
    }

    return keysWithDeposits.map((key) => {
      delete validatorKeysByPubKey[key.publicKey];
      return {
        ...key,
        removalReason: 'public_key_used',
      } as ValidatorKeyToBeRemoved;
    });
  }

  private _getRemovalTransactionBatches(
    chainId: CHAIN_ID,
    operatorRegistryAddress: string,
    keysToRemove: ValidatorKeyToBeRemoved[],
  ) {
    const { removeKeysTransactions: rkt } = this.schema;
    const batchHashLookup: { [operatorIdDashKeyIndex: string]: number } = {};
    const removalTxBatches: {
      [batchNumber: number]: typeof rkt.$inferInsert;
    } = {};

    let batchCount = 0;

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
