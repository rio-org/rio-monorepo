import { Address, Hash } from 'viem';

export type BeaconChainDepositResponse = {
  amount: number;
  block_number: number;
  block_ts: number;
  from_address: Address;
  merkletree_index: Hash;
  publickey: Hash;
  removed: false;
  signature: Hash;
  tx_hash: Hash;
  tx_index: number;
  tx_input: Hash;
  valid_signature: true;
  withdrawal_credentials: Hash;
};
