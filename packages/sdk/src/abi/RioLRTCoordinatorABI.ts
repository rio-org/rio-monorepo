export const RioLRTCoordinatorABI = [
  {
    type: 'constructor',
    inputs: [
      { name: 'issuer_', type: 'address', internalType: 'address' },
      { name: 'ethPOS_', type: 'address', internalType: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'DEPOSIT_ROOT_TYPEHASH',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'assetNextRebalanceAfter',
    inputs: [{ name: 'asset', type: 'address', internalType: 'address' }],
    outputs: [{ name: 'timestamp', type: 'uint40', internalType: 'uint40' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'convertFromAssetToRestakingTokens',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'convertFromUnitOfAccountToRestakingTokens',
    inputs: [{ name: 'value', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'convertToAssetFromRestakingTokens',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'convertToSharesFromRestakingTokens',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [{ name: 'shares', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'convertToUnitOfAccountFromRestakingTokens',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'depositERC20',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'amountIn', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [{ name: 'amountOut', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositETH',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      { name: 'fields', type: 'bytes1', internalType: 'bytes1' },
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'version', type: 'string', internalType: 'string' },
      { name: 'chainId', type: 'uint256', internalType: 'uint256' },
      { name: 'verifyingContract', type: 'address', internalType: 'address' },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      { name: 'extensions', type: 'uint256[]', internalType: 'uint256[]' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'emergencyPauseOperatorUndelegated',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'ethPOS',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract IETHPOSDeposit' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTVL',
    inputs: [],
    outputs: [{ name: 'value', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'guardianSigner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'hashTypedData',
    inputs: [{ name: 'structHash', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      { name: 'initialOwner', type: 'address', internalType: 'address' },
      { name: 'token_', type: 'address', internalType: 'address' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'issuer',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'rebalanceDelay',
    inputs: [],
    outputs: [{ name: '', type: 'uint24', internalType: 'uint24' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'rebalanceERC20',
    inputs: [{ name: 'token', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'rebalanceETH',
    inputs: [
      { name: 'root', type: 'bytes32', internalType: 'bytes32' },
      { name: 'signature', type: 'bytes', internalType: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'requestWithdrawal',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'amountIn', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setGuardianSigner',
    inputs: [
      { name: 'newGuardianSigner', type: 'address', internalType: 'address' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setRebalanceDelay',
    inputs: [
      { name: 'newRebalanceDelay', type: 'uint24', internalType: 'uint24' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'token',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IRioLRT' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      { name: 'newImplementation', type: 'address', internalType: 'address' },
      { name: 'data', type: 'bytes', internalType: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'event',
    name: 'Deposited',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'amountIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'amountOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'GuardianSignerSet',
    inputs: [
      {
        name: 'newGuardianSigner',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'PartiallyRebalanced',
    inputs: [
      { name: 'asset', type: 'address', indexed: true, internalType: 'address' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Paused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RebalanceDelaySet',
    inputs: [
      {
        name: 'newRebalanceDelay',
        type: 'uint24',
        indexed: false,
        internalType: 'uint24'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Rebalanced',
    inputs: [
      { name: 'asset', type: 'address', indexed: true, internalType: 'address' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Unpaused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  { type: 'error', name: 'AMOUNT_MUST_BE_GREATER_THAN_ZERO', inputs: [] },
  {
    type: 'error',
    name: 'ASSET_NOT_SUPPORTED',
    inputs: [{ name: 'asset', type: 'address', internalType: 'address' }]
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }]
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }]
  },
  { type: 'error', name: 'CALLER_MUST_BE_EOA', inputs: [] },
  {
    type: 'error',
    name: 'DEPOSIT_CAP_REACHED',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'depositCap', type: 'uint256', internalType: 'uint256' }
    ]
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      { name: 'implementation', type: 'address', internalType: 'address' }
    ]
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'ETH_TRANSFER_FAILED', inputs: [] },
  { type: 'error', name: 'EnforcedPause', inputs: [] },
  { type: 'error', name: 'ExpectedPause', inputs: [] },
  { type: 'error', name: 'FailedInnerCall', inputs: [] },
  { type: 'error', name: 'INCORRECT_NUMBER_OF_SHARES_QUEUED', inputs: [] },
  { type: 'error', name: 'INSUFFICIENT_SHARES_FOR_WITHDRAWAL', inputs: [] },
  { type: 'error', name: 'INVALID_GUARDIAN_SIGNATURE', inputs: [] },
  { type: 'error', name: 'INVALID_TOKEN_ADDRESS', inputs: [] },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'NO_OPERATOR_UNDELEGATED', inputs: [] },
  { type: 'error', name: 'NO_REBALANCE_NEEDED', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  { type: 'error', name: 'ONLY_COORDINATOR', inputs: [] },
  { type: 'error', name: 'ONLY_DEPOSIT_POOL', inputs: [] },
  { type: 'error', name: 'ONLY_ISSUER', inputs: [] },
  { type: 'error', name: 'ONLY_OPERATOR_REGISTRY', inputs: [] },
  { type: 'error', name: 'ONLY_WITHDRAWAL_QUEUE', inputs: [] },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }]
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }]
  },
  { type: 'error', name: 'REBALANCE_DELAY_NOT_MET', inputs: [] },
  { type: 'error', name: 'REBALANCE_DELAY_TOO_LONG', inputs: [] },
  { type: 'error', name: 'STALE_DEPOSIT_ROOT', inputs: [] },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [{ name: 'token', type: 'address', internalType: 'address' }]
  },
  { type: 'error', name: 'UUPSUnauthorizedCallContext', inputs: [] },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [{ name: 'slot', type: 'bytes32', internalType: 'bytes32' }]
  }
] as const;
