export type KeysToAddLookup = {
  [publicKey: string]: {
    txHash: string;
    publicKey: string;
    signature: string;
    keyIndex: number;
    operatorId: number;
  };
};

export type TransactionLookup = {
  [keyUploadTx: string]: {
    operatorId: number;
    keyUploadTx: string;
    keyUploadTimestamp: string;
    blockNumber: number;
    signaturesByKeys: { [publicKey: string]: string };
    keys: {
      [keyIndex: string]: { publicKey: string; signature: string };
    };
  };
};
