export const RioLRTIssuerABI = [
  {
    type: 'constructor',
    inputs: [
      { name: 'tokenImpl_', type: 'address', internalType: 'address' },
      {
        name: 'coordinatorImpl_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'assetRegistryImpl_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'operatorRegistryImpl_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'avsRegistryImpl_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'depositPoolImpl_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'withdrawalQueueImpl_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'rewardDistributorImpl_',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'nonpayable'
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
    name: 'assetRegistryImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'avsRegistryImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'coordinatorImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'depositPoolImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      { name: 'initialOwner', type: 'address', internalType: 'address' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'isTokenFromFactory',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'issueLRT',
    inputs: [
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'symbol', type: 'string', internalType: 'string' },
      {
        name: 'config',
        type: 'tuple',
        internalType: 'struct IRioLRTIssuer.LRTConfig',
        components: [
          {
            name: 'assets',
            type: 'tuple[]',
            internalType: 'struct IRioLRTAssetRegistry.AssetConfig[]',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address'
              },
              {
                name: 'depositCap',
                type: 'uint96',
                internalType: 'uint96'
              },
              {
                name: 'priceFeed',
                type: 'address',
                internalType: 'address'
              },
              {
                name: 'strategy',
                type: 'address',
                internalType: 'address'
              }
            ]
          },
          {
            name: 'priceFeedDecimals',
            type: 'uint8',
            internalType: 'uint8'
          },
          {
            name: 'operatorRewardPool',
            type: 'address',
            internalType: 'address'
          },
          { name: 'treasury', type: 'address', internalType: 'address' }
        ]
      }
    ],
    outputs: [
      {
        name: 'd',
        type: 'tuple',
        internalType: 'struct IRioLRTIssuer.LRTDeployment',
        components: [
          { name: 'token', type: 'address', internalType: 'address' },
          {
            name: 'coordinator',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'assetRegistry',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'operatorRegistry',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'avsRegistry',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'depositPool',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'withdrawalQueue',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'rewardDistributor',
            type: 'address',
            internalType: 'address'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'operatorRegistryImpl',
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
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'rewardDistributorImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'tokenImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
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
    name: 'withdrawalQueueImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
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
    name: 'LiquidRestakingTokenIssued',
    inputs: [
      {
        name: 'name',
        type: 'string',
        indexed: false,
        internalType: 'string'
      },
      {
        name: 'symbol',
        type: 'string',
        indexed: false,
        internalType: 'string'
      },
      {
        name: 'config',
        type: 'tuple',
        indexed: false,
        internalType: 'struct IRioLRTIssuer.LRTConfig',
        components: [
          {
            name: 'assets',
            type: 'tuple[]',
            internalType: 'struct IRioLRTAssetRegistry.AssetConfig[]',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address'
              },
              {
                name: 'depositCap',
                type: 'uint96',
                internalType: 'uint96'
              },
              {
                name: 'priceFeed',
                type: 'address',
                internalType: 'address'
              },
              {
                name: 'strategy',
                type: 'address',
                internalType: 'address'
              }
            ]
          },
          {
            name: 'priceFeedDecimals',
            type: 'uint8',
            internalType: 'uint8'
          },
          {
            name: 'operatorRewardPool',
            type: 'address',
            internalType: 'address'
          },
          { name: 'treasury', type: 'address', internalType: 'address' }
        ]
      },
      {
        name: 'deployment',
        type: 'tuple',
        indexed: false,
        internalType: 'struct IRioLRTIssuer.LRTDeployment',
        components: [
          { name: 'token', type: 'address', internalType: 'address' },
          {
            name: 'coordinator',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'assetRegistry',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'operatorRegistry',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'avsRegistry',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'depositPool',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'withdrawalQueue',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'rewardDistributor',
            type: 'address',
            internalType: 'address'
          }
        ]
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
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }]
  },
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
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
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
