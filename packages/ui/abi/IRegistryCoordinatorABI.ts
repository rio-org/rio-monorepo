export const IRegistryCoordinatorABI = [
  {
    type: 'function',
    name: 'deregisterOperatorWithCoordinator',
    inputs: [
      { name: 'quorumNumbers', type: 'bytes', internalType: 'bytes' },
      {
        name: 'deregistrationData',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'getCurrentQuorumBitmapByOperatorId',
    inputs: [{ name: 'operatorId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'uint192', internalType: 'uint192' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getOperator',
    inputs: [{ name: 'operator', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IRegistryCoordinator.Operator',
        components: [
          {
            name: 'operatorId',
            type: 'bytes32',
            internalType: 'bytes32'
          },
          {
            name: 'status',
            type: 'uint8',
            internalType: 'enum IRegistryCoordinator.OperatorStatus'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getOperatorFromId',
    inputs: [{ name: 'operatorId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: 'operator', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getOperatorId',
    inputs: [{ name: 'operator', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getOperatorStatus',
    inputs: [{ name: 'operator', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum IRegistryCoordinator.OperatorStatus'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getQuorumBitmapByOperatorIdAtBlockNumberByIndex',
    inputs: [
      { name: 'operatorId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'blockNumber', type: 'uint32', internalType: 'uint32' },
      { name: 'index', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint192', internalType: 'uint192' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getQuorumBitmapIndicesByOperatorIdsAtBlockNumber',
    inputs: [
      { name: 'blockNumber', type: 'uint32', internalType: 'uint32' },
      {
        name: 'operatorIds',
        type: 'bytes32[]',
        internalType: 'bytes32[]'
      }
    ],
    outputs: [{ name: '', type: 'uint32[]', internalType: 'uint32[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getQuorumBitmapUpdateByOperatorIdByIndex',
    inputs: [
      { name: 'operatorId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'index', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IRegistryCoordinator.QuorumBitmapUpdate',
        components: [
          {
            name: 'updateBlockNumber',
            type: 'uint32',
            internalType: 'uint32'
          },
          {
            name: 'nextUpdateBlockNumber',
            type: 'uint32',
            internalType: 'uint32'
          },
          {
            name: 'quorumBitmap',
            type: 'uint192',
            internalType: 'uint192'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getQuorumBitmapUpdateByOperatorIdLength',
    inputs: [{ name: 'operatorId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'numRegistries',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'registerOperatorWithCoordinator',
    inputs: [
      { name: 'quorumNumbers', type: 'bytes', internalType: 'bytes' },
      { name: 'registrationData', type: 'bytes', internalType: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'registries',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'OperatorDeregistered',
    inputs: [
      {
        name: 'operator',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'operatorId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OperatorRegistered',
    inputs: [
      {
        name: 'operator',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'operatorId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      }
    ],
    anonymous: false
  }
] as const;
