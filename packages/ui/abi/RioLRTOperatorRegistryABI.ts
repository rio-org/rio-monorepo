export const RioLRTOperatorRegistryABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'initialBeaconOwner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'operatorDelegatorImpl_',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'MAX_ACTIVE_OPERATOR_COUNT',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'MAX_OPERATOR_COUNT',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
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
    name: 'activateOperator',
    inputs: [{ name: 'operatorId', type: 'uint8', internalType: 'uint8' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'activeOperatorCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'addOperator',
    inputs: [
      { name: 'operator', type: 'address', internalType: 'address' },
      {
        name: 'initialManager',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'initialEarningsReceiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'initialMetadataURI',
        type: 'string',
        internalType: 'string'
      },
      {
        name: 'strategyShareCaps',
        type: 'tuple[]',
        internalType: 'struct IRioLRTOperatorRegistry.StrategyShareCap[]',
        components: [
          {
            name: 'strategy',
            type: 'address',
            internalType: 'address'
          },
          { name: 'cap', type: 'uint128', internalType: 'uint128' }
        ]
      },
      { name: 'validatorCap', type: 'uint40', internalType: 'uint40' }
    ],
    outputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      { name: 'delegator', type: 'address', internalType: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'addValidatorDetails',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      {
        name: 'validatorCount',
        type: 'uint256',
        internalType: 'uint256'
      },
      { name: 'publicKeys', type: 'bytes', internalType: 'bytes' },
      { name: 'signatures', type: 'bytes', internalType: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allocateETHDeposits',
    inputs: [
      {
        name: 'depositsToAllocate',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'depositsAllocated',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'allocations',
        type: 'tuple[]',
        internalType: 'struct IRioLRTOperatorRegistry.OperatorETHAllocation[]',
        components: [
          {
            name: 'operator',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'deposits',
            type: 'uint256',
            internalType: 'uint256'
          },
          { name: 'pubKeyBatch', type: 'bytes', internalType: 'bytes' },
          {
            name: 'signatureBatch',
            type: 'bytes',
            internalType: 'bytes'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allocateStrategyShares',
    inputs: [
      { name: 'strategy', type: 'address', internalType: 'address' },
      {
        name: 'sharesToAllocate',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'sharesAllocated',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'allocations',
        type: 'tuple[]',
        internalType:
          'struct IRioLRTOperatorRegistry.OperatorStrategyAllocation[]',
        components: [
          {
            name: 'operator',
            type: 'address',
            internalType: 'address'
          },
          { name: 'shares', type: 'uint256', internalType: 'uint256' },
          { name: 'tokens', type: 'uint256', internalType: 'uint256' }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'assetRegistry',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IRioLRTAssetRegistry'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'avsRegistry',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IRioLRTAVSRegistry'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'confirmOperatorManager',
    inputs: [{ name: 'operatorId', type: 'uint8', internalType: 'uint8' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'coordinator',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IRioLRTCoordinator'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'deactivateOperator',
    inputs: [{ name: 'operatorId', type: 'uint8', internalType: 'uint8' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'deallocateETHDeposits',
    inputs: [
      {
        name: 'depositsToDeallocate',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'depositsDeallocated',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'deallocations',
        type: 'tuple[]',
        internalType:
          'struct IRioLRTOperatorRegistry.OperatorETHDeallocation[]',
        components: [
          {
            name: 'operator',
            type: 'address',
            internalType: 'address'
          },
          { name: 'deposits', type: 'uint256', internalType: 'uint256' }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'deallocateStrategyShares',
    inputs: [
      { name: 'strategy', type: 'address', internalType: 'address' },
      {
        name: 'sharesToDeallocate',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'sharesDeallocated',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'deallocations',
        type: 'tuple[]',
        internalType:
          'struct IRioLRTOperatorRegistry.OperatorStrategyDeallocation[]',
        components: [
          {
            name: 'operator',
            type: 'address',
            internalType: 'address'
          },
          { name: 'shares', type: 'uint256', internalType: 'uint256' },
          { name: 'tokens', type: 'uint256', internalType: 'uint256' }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositPool',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getOperatorDetails',
    inputs: [{ name: 'operatorId', type: 'uint8', internalType: 'uint8' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IRioLRTOperatorRegistry.OperatorPublicDetails',
        components: [
          { name: 'active', type: 'bool', internalType: 'bool' },
          {
            name: 'operatorContract',
            type: 'address',
            internalType: 'address'
          },
          { name: 'manager', type: 'address', internalType: 'address' },
          {
            name: 'pendingManager',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'earningsReceiver',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'validatorDetails',
            type: 'tuple',
            internalType:
              'struct IRioLRTOperatorRegistry.OperatorValidatorDetails',
            components: [
              {
                name: 'nextConfirmationTimestamp',
                type: 'uint40',
                internalType: 'uint40'
              },
              { name: 'cap', type: 'uint40', internalType: 'uint40' },
              { name: 'total', type: 'uint40', internalType: 'uint40' },
              {
                name: 'confirmed',
                type: 'uint40',
                internalType: 'uint40'
              },
              {
                name: 'deposited',
                type: 'uint40',
                internalType: 'uint40'
              },
              { name: 'exited', type: 'uint40', internalType: 'uint40' }
            ]
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getOperatorShareDetails',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      { name: 'strategy', type: 'address', internalType: 'address' }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IRioLRTOperatorRegistry.OperatorShareDetails',
        components: [
          { name: 'cap', type: 'uint128', internalType: 'uint128' },
          {
            name: 'allocation',
            type: 'uint128',
            internalType: 'uint128'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'initialOwner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'coordinator_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'assetRegistry_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'avsRegistry_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'depositPool_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'rewardDistributor_',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'minStakerOptOutBlocks',
    inputs: [],
    outputs: [{ name: '', type: 'uint24', internalType: 'uint24' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'operatorDelegatorBeaconImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'operatorCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
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
    name: 'removeValidatorDetails',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      { name: 'fromIndex', type: 'uint256', internalType: 'uint256' },
      {
        name: 'validatorCount',
        type: 'uint256',
        internalType: 'uint256'
      }
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
    name: 'rewardDistributor',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'securityDaemon',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'setMinStakerOptOutBlocks',
    inputs: [
      {
        name: 'newMinStakerOptOutBlocks',
        type: 'uint24',
        internalType: 'uint24'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setOperatorEarningsReceiver',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      {
        name: 'newEarningsReceiver',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setOperatorPendingManager',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      {
        name: 'newPendingManager',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setOperatorStrategyShareCaps',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      {
        name: 'newStrategyShareCaps',
        type: 'tuple[]',
        internalType: 'struct IRioLRTOperatorRegistry.StrategyShareCap[]',
        components: [
          {
            name: 'strategy',
            type: 'address',
            internalType: 'address'
          },
          { name: 'cap', type: 'uint128', internalType: 'uint128' }
        ]
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setOperatorValidatorCap',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      {
        name: 'newValidatorCap',
        type: 'uint40',
        internalType: 'uint40'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setSecurityDaemon',
    inputs: [
      {
        name: 'newSecurityDaemon',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setValidatorKeyReviewPeriod',
    inputs: [
      {
        name: 'newValidatorKeyReviewPeriod',
        type: 'uint24',
        internalType: 'uint24'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
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
      {
        name: 'newImplementation',
        type: 'address',
        internalType: 'address'
      },
      { name: 'data', type: 'bytes', internalType: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'validatorKeyReviewPeriod',
    inputs: [],
    outputs: [{ name: '', type: 'uint24', internalType: 'uint24' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'verifyWithdrawalCredentials',
    inputs: [
      { name: 'operatorId', type: 'uint8', internalType: 'uint8' },
      {
        name: 'oracleTimestamp',
        type: 'uint64',
        internalType: 'uint64'
      },
      {
        name: 'stateRootProof',
        type: 'tuple',
        internalType: 'struct IBeaconChainProofs.StateRootProof',
        components: [
          {
            name: 'beaconStateRoot',
            type: 'bytes32',
            internalType: 'bytes32'
          },
          { name: 'proof', type: 'bytes', internalType: 'bytes' }
        ]
      },
      {
        name: 'validatorIndices',
        type: 'uint40[]',
        internalType: 'uint40[]'
      },
      {
        name: 'validatorFieldsProofs',
        type: 'bytes[]',
        internalType: 'bytes[]'
      },
      {
        name: 'validatorFields',
        type: 'bytes32[][]',
        internalType: 'bytes32[][]'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
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
    name: 'MinStakerOptOutBlocksSet',
    inputs: [
      {
        name: 'minStakerOptOutBlocks',
        type: 'uint24',
        indexed: false,
        internalType: 'uint24'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorActivated',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorAdded',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'operator',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'delegator',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'initialManager',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'initialEarningsReceiver',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'initialMetadataURI',
        type: 'string',
        indexed: false,
        internalType: 'string'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorDeactivated',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorEarningsReceiverSet',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'earningsReceiver',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorManagerSet',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'manager',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorPendingManagerSet',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'pendingManager',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorPendingValidatorDetailsAdded',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'validatorCount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorPendingValidatorDetailsRemoved',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'validatorCount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorStrategyExitQueued',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'strategy',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'sharesToExit',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorStrategyShareCapSet',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'strategy',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'cap',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorValidatorCapSet',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'cap',
        type: 'uint40',
        indexed: false,
        internalType: 'uint40'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorWithdrawalCredentialsVerified',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'oracleTimestamp',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64'
      },
      {
        name: 'validatorIndices',
        type: 'uint40[]',
        indexed: false,
        internalType: 'uint40[]'
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
    name: 'SecurityDaemonSet',
    inputs: [
      {
        name: 'securityDaemon',
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
  {
    type: 'event',
    name: 'ValidatorDetailsAdded',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'pubkey',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'ValidatorDetailsRemoved',
    inputs: [
      {
        name: 'operatorId',
        type: 'uint8',
        indexed: true,
        internalType: 'uint8'
      },
      {
        name: 'pubkey',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'ValidatorKeyReviewPeriodSet',
    inputs: [
      {
        name: 'validatorKeyReviewPeriod',
        type: 'uint24',
        indexed: false,
        internalType: 'uint24'
      }
    ],
    anonymous: false
  },
  { type: 'error', name: 'AVS_NOT_ACTIVE', inputs: [] },
  { type: 'error', name: 'AVS_NOT_REGISTERED', inputs: [] },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }]
  },
  { type: 'error', name: 'CANNOT_EXIT_ZERO_SHARES', inputs: [] },
  { type: 'error', name: 'EMPTY_KEY', inputs: [] },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'FailedInnerCall', inputs: [] },
  { type: 'error', name: 'HEAP_OVERFLOW', inputs: [] },
  { type: 'error', name: 'HEAP_UNDERFLOW', inputs: [] },
  { type: 'error', name: 'INVALID_EARNINGS_RECEIVER', inputs: [] },
  { type: 'error', name: 'INVALID_HEAP_SIZE', inputs: [] },
  { type: 'error', name: 'INVALID_INDEX', inputs: [] },
  { type: 'error', name: 'INVALID_INDEX', inputs: [] },
  { type: 'error', name: 'INVALID_KEYS_COUNT', inputs: [] },
  { type: 'error', name: 'INVALID_MANAGER', inputs: [] },
  { type: 'error', name: 'INVALID_OPERATOR', inputs: [] },
  { type: 'error', name: 'INVALID_OPERATOR_DELEGATOR', inputs: [] },
  { type: 'error', name: 'INVALID_PENDING_MANAGER', inputs: [] },
  { type: 'error', name: 'INVALID_VALIDATOR_COUNT', inputs: [] },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'LENGTH_MISMATCH', inputs: [] },
  {
    type: 'error',
    name: 'MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED',
    inputs: []
  },
  { type: 'error', name: 'MAX_OPERATOR_COUNT_EXCEEDED', inputs: [] },
  {
    type: 'error',
    name: 'NO_AVAILABLE_OPERATORS_FOR_ALLOCATION',
    inputs: []
  },
  {
    type: 'error',
    name: 'NO_AVAILABLE_OPERATORS_FOR_DEALLOCATION',
    inputs: []
  },
  { type: 'error', name: 'NO_SLASHING_CONTRACT_FOR_AVS', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  { type: 'error', name: 'ONLY_COORDINATOR', inputs: [] },
  { type: 'error', name: 'ONLY_DEPOSIT_POOL', inputs: [] },
  { type: 'error', name: 'ONLY_OPERATOR_MANAGER', inputs: [] },
  {
    type: 'error',
    name: 'ONLY_OPERATOR_MANAGER_OR_SECURITY_DAEMON',
    inputs: []
  },
  { type: 'error', name: 'ONLY_OPERATOR_PENDING_MANAGER', inputs: [] },
  { type: 'error', name: 'OPERATOR_ALREADY_ACTIVE', inputs: [] },
  { type: 'error', name: 'OPERATOR_ALREADY_INACTIVE', inputs: [] },
  { type: 'error', name: 'OPERATOR_NOT_ACTIVE', inputs: [] },
  { type: 'error', name: 'OPERATOR_NOT_FOUND', inputs: [] },
  {
    type: 'error',
    name: 'OPERATOR_STILL_HAS_ALLOCATED_SHARES',
    inputs: []
  },
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
  { type: 'error', name: 'UUPSUnauthorizedCallContext', inputs: [] },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [{ name: 'slot', type: 'bytes32', internalType: 'bytes32' }]
  }
] as const;
