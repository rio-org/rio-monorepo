import { Address, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { GUARDIAN_STUB_PRIVATE_KEY } from '../config';

const signer = privateKeyToAccount(GUARDIAN_STUB_PRIVATE_KEY);
const types = {
  DepositRoot: [{ name: 'root', type: 'bytes32' }]
} as const;

const getDomain = (chainId: number, verifyingContract: Address) => ({
  name: 'Rio Network',
  version: '1',
  chainId,
  verifyingContract
});

export async function signDepositRoot(params: {
  chainId: number;
  verifyingContract: Address;
  root: Hex;
}): Promise<Hex> {
  const { chainId, verifyingContract, root } = params;
  return signer.signTypedData({
    domain: getDomain(chainId, verifyingContract),
    types,
    primaryType: 'DepositRoot',
    message: { root }
  });
}
