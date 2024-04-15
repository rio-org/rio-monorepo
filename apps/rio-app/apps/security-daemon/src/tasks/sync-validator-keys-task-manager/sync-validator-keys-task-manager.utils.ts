import { Injectable } from '@nestjs/common';
import {
  Address,
  Hash,
  Hex,
  Log,
  PublicClient,
  decodeEventLog,
  toEventSelector,
} from 'viem';
import { BeaconChainDepositResponse } from '@rio-app/common/types/validators.types';
import { AddedValidatorKey } from './sync-validator-keys-task-manager.types';

@Injectable()
export class SyncValidatorKeysUtils {
  static rebalanceEventSelector = toEventSelector('Rebalanced(address)');
  static depositEventSelector = toEventSelector(
    'DepositEvent(bytes pubkey, bytes withdrawal_credentials, bytes amount, bytes signature, bytes index)',
  );
  static depositAddress = `0x${[...Array(20)].fill(42).join('')}`;

  /**
   * Builds the URL to fetch the validator information from beaconcha.in
   * @param {number} chainId The chain id
   */
  async buildBeaconChainValidatorUrl(chainId: number) {
    let subdomain = '';
    switch (chainId) {
      case 1:
        break;
      case 5:
        subdomain = 'goerli.';
        break;
      case 17000:
        subdomain = 'holesky.';
        break;
      default:
        throw new Error('Unsupported chain id');
    }

    return `https://${subdomain}beaconcha.in/api/v1/validator/`;
  }

  decodeDepositLog(
    log: Log<bigint, number, false> & {
      topics: [signature: Hex, ...args: Hex[]];
    },
  ): null | {
    eventName: 'DepositEvent';
    args: {
      pubkey: Hex;
      withdrawal_credentials: Hex;
      amount: Hex;
      signature: Hex;
      index: Hex;
    };
  } {
    try {
      return decodeEventLog({
        abi: [
          {
            type: 'event',
            inputs: [
              { type: 'bytes', name: 'pubkey' },
              { type: 'bytes', name: 'withdrawal_credentials' },
              { type: 'bytes', name: 'amount' },
              { type: 'bytes', name: 'signature' },
              { type: 'bytes', name: 'index' },
            ],
            name: 'DepositEvent',
          },
        ],
        data: log.data,
        topics: log.topics,
      });
    } catch {
      return null;
    }
  }

  /**
   * Verifies that any deposits to the given pubkeys are allowed, and returns the invalid ones.
   * @dev Max lengh ot the pubkeys array is 100
   * @param {number} chainId The chain id
   * @param {Address} coordinatorAddress The coordinator address
   * @param {Array<AddedValidatorKey>} pubkeys The symbol
   * @param {PublicClient} publicClient The public client
   */
  async verifyValidatorKeysAreUnused(
    chainId: number,
    coordinatorAddress: Address,
    pubkeys: Array<AddedValidatorKey>,
    publicClient: PublicClient,
  ): Promise<AddedValidatorKey[]> {
    if (pubkeys.length) throw new Error('Pubkeys array is empty');
    if (pubkeys.length > 100)
      throw new Error('Max length of pubkeys array is 100');

    const addedKeyInfoByPubkey = Object.fromEntries(
      pubkeys.map((keyInfo) => [keyInfo.publicKey, keyInfo]),
    );
    const keysToBeRemoved: AddedValidatorKey[] = [];
    const threeDays = BigInt(3 * 24 * 60 * 60);

    const response = await fetch(
      `${this.buildBeaconChainValidatorUrl(chainId)}/${pubkeys
        .map((k) => k.publicKey)
        .join(',')}/deposits`,
    );

    const body: {
      status: string;
      data: BeaconChainDepositResponse[];
    } = await response.json().catch(() => ({
      status: 'ERROR',
      data: [],
    }));

    const { status, data } = body;

    if (status !== 'OK') {
      throw new Error('Failed to fetch deposits');
    }

    for await (const deposit of data) {
      const addedKeyInfo = addedKeyInfoByPubkey[deposit.publickey];
      const [depositReceipt, keyAddedTx] = await Promise.all([
        publicClient.getTransactionReceipt({ hash: deposit.tx_hash }),
        publicClient.getTransaction({
          hash: addedKeyInfo.txHash as Hash,
        }),
      ]);

      /**
       * @todo
       * If either txReceipt is null, store error somewhere
       */

      if (depositReceipt === null) {
        console.error(
          `Failed to fetch tx receipt for deposit tx ${deposit.tx_hash}`,
        );
        continue;
      }
      if (keyAddedTx === null) {
        console.error(`Failed to fetch keyAddedTx ${addedKeyInfo.txHash}`);
        continue;
      }

      const logs = depositReceipt.logs as (Log<bigint, number, false> & {
        topics: [signature: Hex, ...args: Hex[]];
      })[];

      const rebalanceEventLog = logs.find(
        (log) =>
          log.topics[0] === SyncValidatorKeysUtils.rebalanceEventSelector &&
          log.address.toLowerCase() === coordinatorAddress.toLowerCase(),
      );
      const depositEventLog = logs.find(
        (log) =>
          log.topics[0] === SyncValidatorKeysUtils.depositEventSelector &&
          log.address === SyncValidatorKeysUtils.depositAddress &&
          this.decodeDepositLog(log)?.args.pubkey === deposit.publickey,
      );
      const addedKeyBlock = await publicClient.getBlock({
        blockNumber: keyAddedTx.blockNumber,
      });

      if (!rebalanceEventLog || !depositEventLog) {
        keysToBeRemoved.push(addedKeyInfo);
      } else if (depositEventLog.logIndex < rebalanceEventLog.logIndex) {
        keysToBeRemoved.push(addedKeyInfo);
      } else if (addedKeyBlock.timestamp + threeDays > deposit.block_ts) {
        keysToBeRemoved.push(addedKeyInfo);
      }
    }

    return keysToBeRemoved;
  }
}
