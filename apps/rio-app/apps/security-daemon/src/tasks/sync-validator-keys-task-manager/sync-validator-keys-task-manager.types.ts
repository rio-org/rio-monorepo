import { RemoveKeysTransaction } from '@internal/db/dist/src/schemas/security';

export type AddedValidatorKeyInfo = {
  txHash: string;
  publicKey: string;
  signature: string;
  keyIndex: number;
  operatorId: number;
  removalReason?: never;
};

export interface ValidatorKeyToBeRemoved
  extends Omit<AddedValidatorKeyInfo, 'removalReason'>,
    Pick<RemoveKeysTransaction, 'removalReason'> {}

export type AddedValidatorKey = AddedValidatorKeyInfo | ValidatorKeyToBeRemoved;

export type ValidatorKeysByPubKey = {
  [publicKey: string]: AddedValidatorKey;
};

export type AddedValidatorKeyTxInformation = {
  operatorId: number;
  keyUploadTx: string;
  keyUploadTimestamp: string;
  blockNumber: number;
  signaturesByKeys: { [publicKey: string]: string };
  keys: {
    [keyIndex: string]: { publicKey: string; signature: string };
  };
};

export type TransactionInformationByHash = {
  [keyUploadTx: string]: AddedValidatorKeyTxInformation;
};
