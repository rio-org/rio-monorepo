export const RioLRTWithdrawalQueueABI = [
  {
    type: 'constructor',
    inputs: [
      { name: 'issuer_', type: 'address', internalType: 'address' },
      { name: 'delegationManager_', type: 'address', internalType: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: '_computeWithdrawalRoot',
    inputs: [
      {
        name: 'withdrawal',
        type: 'tuple',
        internalType: 'struct IDelegationManager.Withdrawal',
        components: [
          { name: 'staker', type: 'address', internalType: 'address' },
          { name: 'delegatedTo', type: 'address', internalType: 'address' },
          { name: 'withdrawer', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'startBlock', type: 'uint32', internalType: 'uint32' },
          { name: 'strategies', type: 'address[]', internalType: 'address[]' },
          { name: 'shares', type: 'uint256[]', internalType: 'uint256[]' }
        ]
      }
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    name: 'claimWithdrawalsForEpoch',
    inputs: [
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct IRioLRTWithdrawalQueue.ClaimRequest',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'epoch', type: 'uint256', internalType: 'uint256' }
        ]
      }
    ],
    outputs: [{ name: 'amountOut', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'claimWithdrawalsForManyEpochs',
    inputs: [
      {
        name: 'requests',
        type: 'tuple[]',
        internalType: 'struct IRioLRTWithdrawalQueue.ClaimRequest[]',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'epoch', type: 'uint256', internalType: 'uint256' }
        ]
      }
    ],
    outputs: [
      { name: 'amountsOut', type: 'uint256[]', internalType: 'uint256[]' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'delegationManager',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract IDelegationManager' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getCurrentEpoch',
    inputs: [{ name: 'asset', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getEpochWithdrawalSummary',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'epoch', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IRioLRTWithdrawalQueue.EpochWithdrawalSummary',
        components: [
          { name: 'settled', type: 'bool', internalType: 'bool' },
          { name: 'assetsReceived', type: 'uint120', internalType: 'uint120' },
          {
            name: 'shareValueOfAssetsReceived',
            type: 'uint120',
            internalType: 'uint120'
          },
          { name: 'sharesOwed', type: 'uint120', internalType: 'uint120' },
          { name: 'aggregateRoot', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'amountToBurnAtSettlement',
            type: 'uint256',
            internalType: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getSharesOwedInCurrentEpoch',
    inputs: [{ name: 'asset', type: 'address', internalType: 'address' }],
    outputs: [{ name: 'sharesOwed', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getUserWithdrawalSummary',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'epoch', type: 'uint256', internalType: 'uint256' },
      { name: 'user', type: 'address', internalType: 'address' }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IRioLRTWithdrawalQueue.UserWithdrawalSummary',
        components: [
          { name: 'claimed', type: 'bool', internalType: 'bool' },
          { name: 'sharesOwed', type: 'uint120', internalType: 'uint120' }
        ]
      }
    ],
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
    name: 'proxiableUUID',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'queueCurrentEpochSettlement',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'assetsReceived', type: 'uint256', internalType: 'uint256' },
      {
        name: 'shareValueOfAssetsReceived',
        type: 'uint256',
        internalType: 'uint256'
      },
      { name: 'aggregateRoot', type: 'bytes32', internalType: 'bytes32' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'queueWithdrawal',
    inputs: [
      { name: 'withdrawer', type: 'address', internalType: 'address' },
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'sharesOwed', type: 'uint256', internalType: 'uint256' },
      { name: 'amountIn', type: 'uint256', internalType: 'uint256' }
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
    name: 'settleCurrentEpoch',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'assetsReceived', type: 'uint256', internalType: 'uint256' },
      {
        name: 'shareValueOfAssetsReceived',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'settleEpochFromEigenLayer',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'epoch', type: 'uint256', internalType: 'uint256' },
      {
        name: 'queuedWithdrawals',
        type: 'tuple[]',
        internalType: 'struct IDelegationManager.Withdrawal[]',
        components: [
          { name: 'staker', type: 'address', internalType: 'address' },
          { name: 'delegatedTo', type: 'address', internalType: 'address' },
          { name: 'withdrawer', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'startBlock', type: 'uint32', internalType: 'uint32' },
          { name: 'strategies', type: 'address[]', internalType: 'address[]' },
          { name: 'shares', type: 'uint256[]', internalType: 'uint256[]' }
        ]
      },
      {
        name: 'middlewareTimesIndexes',
        type: 'uint256[]',
        internalType: 'uint256[]'
      }
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
    name: 'EpochQueuedForSettlementFromEigenLayer',
    inputs: [
      {
        name: 'epoch',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256'
      },
      {
        name: 'asset',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'assetsReceived',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'shareValueOfAssetsReceived',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'restakingTokensBurned',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'aggregateRoot',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'EpochSettledFromDepositPool',
    inputs: [
      {
        name: 'epoch',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256'
      },
      {
        name: 'asset',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'assetsReceived',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'EpochSettledFromEigenLayer',
    inputs: [
      {
        name: 'epoch',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256'
      },
      {
        name: 'asset',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'assetsReceived',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
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
  {
    type: 'event',
    name: 'WithdrawalQueued',
    inputs: [
      {
        name: 'epoch',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256'
      },
      {
        name: 'asset',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'withdrawer',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'sharesOwed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'amountIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'WithdrawalsClaimedForEpoch',
    inputs: [
      {
        name: 'epoch',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256'
      },
      {
        name: 'asset',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'withdrawer',
        type: 'address',
        indexed: false,
        internalType: 'address'
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
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }]
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }]
  },
  { type: 'error', name: 'EPOCH_ALREADY_SETTLED', inputs: [] },
  { type: 'error', name: 'EPOCH_NOT_SETTLED', inputs: [] },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      { name: 'implementation', type: 'address', internalType: 'address' }
    ]
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'ETH_TRANSFER_FAILED', inputs: [] },
  { type: 'error', name: 'FailedInnerCall', inputs: [] },
  { type: 'error', name: 'INVALID_AGGREGATE_WITHDRAWAL_ROOT', inputs: [] },
  {
    type: 'error',
    name: 'INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH',
    inputs: []
  },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'NO_SHARES_OWED', inputs: [] },
  { type: 'error', name: 'NO_SHARES_OWED_IN_EPOCH', inputs: [] },
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
  {
    type: 'error',
    name: 'SafeCastOverflowedUintDowncast',
    inputs: [
      { name: 'bits', type: 'uint8', internalType: 'uint8' },
      { name: 'value', type: 'uint256', internalType: 'uint256' }
    ]
  },
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
  },
  { type: 'error', name: 'WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH', inputs: [] },
  { type: 'error', name: 'WITHDRAWALS_NOT_QUEUED_FOR_EPOCH', inputs: [] },
  { type: 'error', name: 'WITHDRAWAL_ALREADY_CLAIMED', inputs: [] }
] as const;
