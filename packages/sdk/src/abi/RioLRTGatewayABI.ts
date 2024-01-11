export const RioLRTGatewayABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenWrapperFactory_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'weth_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'vault_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'balancerQueries_',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'AUM_FEE_TOO_HIGH',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CANNOT_UNWRAP_ZERO_AMOUNT',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CANNOT_WRAP_ZERO_AMOUNT',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ETH_TRANSFER_FAILED',
    type: 'error'
  },
  {
    inputs: [],
    name: 'EXIT_ABOVE_MAX',
    type: 'error'
  },
  {
    inputs: [],
    name: 'EXIT_BELOW_MIN',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INPUT_LENGTH_MISMATCH',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INVALID_INITIALIZATION',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INVALID_SWAP_FEE_END_TIME',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INVALID_TOKEN',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NO_WRAPPER_FOR_TOKEN',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ONLY_OWNER_OR_SECURITY_COUNCIL',
    type: 'error'
  },
  {
    inputs: [],
    name: 'SENDER_IS_NOT_VAULT',
    type: 'error'
  },
  {
    inputs: [],
    name: 'SWAP_FEE_TOO_HIGH',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wrapper',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'failure',
        type: 'bytes'
      }
    ],
    name: 'TOKEN_UNWRAP_FAILED',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wrapper',
        type: 'address'
      }
    ],
    name: 'TOKEN_WRAPPER_SETUP_FAILED',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wrapper',
        type: 'address'
      }
    ],
    name: 'TOKEN_WRAPPER_TEARDOWN_FAILED',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wrapper',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'failure',
        type: 'bytes'
      }
    ],
    name: 'TOKEN_WRAP_FAILED',
    type: 'error'
  },
  {
    inputs: [],
    name: 'WEIGHT_CHANGE_TOO_FAST',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address'
      }
    ],
    name: 'AdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address'
      }
    ],
    name: 'BeaconUpgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokensIn',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amountsIn',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256'
      }
    ],
    name: 'JoinedAllTokensExactOut',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256'
      }
    ],
    name: 'JoinedTokenExactOut',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokensIn',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amountsIn',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256'
      }
    ],
    name: 'JoinedTokensExactIn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'newSecurityCouncil',
        type: 'address'
      }
    ],
    name: 'SecurityCouncilChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'newSecurityDaemon',
        type: 'address'
      }
    ],
    name: 'SecurityDaemonChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountAdded',
        type: 'uint256'
      }
    ],
    name: 'TokenAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountRemoved',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokensBurned',
        type: 'uint256'
      }
    ],
    name: 'TokenRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawer',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cash',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256'
      }
    ],
    name: 'WithdrawalRequestProcessed',
    type: 'event'
  },
  {
    inputs: [],
    name: 'MAX_AUM_FEE_PERCENTAGE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_SWAP_FEE_PERCENTAGE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MIN_WEIGHT_CHANGE_DURATION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'strategy',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: 'targetAUMPercentage',
        type: 'uint64'
      }
    ],
    name: 'addToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'assetManager',
    outputs: [
      {
        internalType: 'contract IRioLRTAssetManager',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'balancerQueries',
    outputs: [
      {
        internalType: 'contract IBalancerQueries',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address'
      },
      {
        internalType: 'bytes32',
        name: 'poolId_',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'restakingToken_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'assetManager_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'withdrawalQueue_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'securityCouncil',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: 'allowedLPs',
        type: 'address[]'
      },
      {
        components: [
          {
            internalType: 'address[]',
            name: 'tokensIn',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'amountsIn',
            type: 'uint256[]'
          },
          {
            internalType: 'address[]',
            name: 'strategies',
            type: 'address[]'
          },
          {
            internalType: 'uint64[]',
            name: 'targetAUMPercentages',
            type: 'uint64[]'
          }
        ],
        internalType: 'struct IRioLRTGateway.InitializeParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'initialize',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'tokensIn',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'maxAmountsIn',
            type: 'uint256[]'
          },
          {
            internalType: 'bool[]',
            name: 'requiresWrap',
            type: 'bool[]'
          },
          {
            internalType: 'uint256',
            name: 'amountOut',
            type: 'uint256'
          }
        ],
        internalType: 'struct IRioLRTGateway.JoinAllTokensExactOutParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'joinAllTokensExactOut',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenIn',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'maxAmountIn',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'requiresWrap',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'amountOut',
            type: 'uint256'
          }
        ],
        internalType: 'struct IRioLRTGateway.JoinTokenExactOutParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'joinTokenExactOut',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'tokensIn',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'amountsIn',
            type: 'uint256[]'
          },
          {
            internalType: 'bool[]',
            name: 'requiresWrap',
            type: 'bool[]'
          },
          {
            internalType: 'uint256',
            name: 'minAmountOut',
            type: 'uint256'
          }
        ],
        internalType: 'struct IRioLRTGateway.JoinTokensExactInParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'joinTokensExactIn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pool',
    outputs: [
      {
        internalType: 'contract IManagedPool',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'poolId',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      }
    ],
    name: 'removeToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'tokensOut',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'minAmountsOut',
            type: 'uint256[]'
          },
          {
            internalType: 'bool[]',
            name: 'requiresUnwrap',
            type: 'bool[]'
          },
          {
            internalType: 'uint256',
            name: 'amountIn',
            type: 'uint256'
          }
        ],
        internalType: 'struct IRioLRTGateway.ExitAllTokensExactInParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'requestExitAllTokensExactIn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenOut',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'minAmountOut',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'requiresUnwrap',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'amountIn',
            type: 'uint256'
          }
        ],
        internalType: 'struct IRioLRTGateway.ExitTokenExactInParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'requestExitTokenExactIn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'tokensOut',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'amountsOut',
            type: 'uint256[]'
          },
          {
            internalType: 'bool[]',
            name: 'requiresUnwrap',
            type: 'bool[]'
          },
          {
            internalType: 'uint256',
            name: 'maxAmountIn',
            type: 'uint256'
          }
        ],
        internalType: 'struct IRioLRTGateway.ExitTokensExactOutParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'requestExitTokensExactOut',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'restakingToken',
    outputs: [
      {
        internalType: 'contract IRioLRT',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startSwapFeePercentage',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endSwapFeePercentage',
        type: 'uint256'
      }
    ],
    name: 'scheduleGradualSwapFeeChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'endWeights',
        type: 'uint256[]'
      }
    ],
    name: 'scheduleGradualWeightChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'securityCouncil',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'securityDaemon',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'bptPrices',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'lowerBoundPercentages',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'upperBoundPercentages',
        type: 'uint256[]'
      }
    ],
    name: 'setCircuitBreakers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'aumFeePercentage',
        type: 'uint256'
      }
    ],
    name: 'setManagementAumFeePercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newSecurityCouncil',
        type: 'address'
      }
    ],
    name: 'setSecurityCouncil',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newSecurityDaemon',
        type: 'address'
      }
    ],
    name: 'setSecurityDaemon',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'swapEnabled',
        type: 'bool'
      }
    ],
    name: 'setSwapEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startSwapFeePercentage',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endSwapFeePercentage',
        type: 'uint256'
      }
    ],
    name: 'startGradualSwapFeeChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'endWeights',
        type: 'uint256[]'
      }
    ],
    name: 'startGradualWeightChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tokenWrapperFactory',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      }
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
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
  },
  {
    inputs: [],
    name: 'weth',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdrawalQueue',
    outputs: [
      {
        internalType: 'contract IRioLRTWithdrawalQueue',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
] as const;