export const BalancerHelpersABI = [
  {
    inputs: [
      {
        internalType: 'contract IVault',
        name: '_vault',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'poolId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        components: [
          {
            internalType: 'contract IAsset[]',
            name: 'assets',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'minAmountsOut',
            type: 'uint256[]'
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes'
          },
          {
            internalType: 'bool',
            name: 'toInternalBalance',
            type: 'bool'
          }
        ],
        internalType: 'struct IVault.ExitPoolRequest',
        name: 'request',
        type: 'tuple'
      }
    ],
    name: 'queryExit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'bptIn',
        type: 'uint256'
      },
      {
        internalType: 'uint256[]',
        name: 'amountsOut',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'poolId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        components: [
          {
            internalType: 'contract IAsset[]',
            name: 'assets',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'maxAmountsIn',
            type: 'uint256[]'
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes'
          },
          {
            internalType: 'bool',
            name: 'fromInternalBalance',
            type: 'bool'
          }
        ],
        internalType: 'struct IVault.JoinPoolRequest',
        name: 'request',
        type: 'tuple'
      }
    ],
    name: 'queryJoin',
    outputs: [
      {
        internalType: 'uint256',
        name: 'bptOut',
        type: 'uint256'
      },
      {
        internalType: 'uint256[]',
        name: 'amountsIn',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'vault',
    outputs: [
      {
        internalType: 'contract IVault',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
