<h1 align="center">
  @rionetwork/protocol
</h1>
<p align="center">
  The Rio Network protocol contracts
</p>
<p align="center">
  <a href="https://rio.network/">
    <img src="https://img.shields.io/badge/website-rio.network-blue">
  </a>
</p>

## Contract Addresses

### Goerli

#### Global

| Contract                                               | Address                                                                                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [RioLRTIssuer](./contracts/restaking/RioLRTIssuer.sol) | [0x74ff9755c22E97E1acB35f273784e21375a9f0c8](https://goerli.etherscan.io/address/0x74ff9755c22E97E1acB35f273784e21375a9f0c8) |

#### Restaked Ether

| Contract                                                                     | Address                                                                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [RioLRT](./contracts/restaking/RioLRT.sol)                                   | [0x87355D7d4736c7641452563620aF267634E7F557](https://goerli.etherscan.io/address/0x87355D7d4736c7641452563620aF267634E7F557) |
| [RioLRTCoordinator](./contracts/restaking/RioLRTCoordinator.sol)             | [0x4944C6268DeDD0F4d9c840B6C389a7c5C7dD473a](https://goerli.etherscan.io/address/0x4944C6268DeDD0F4d9c840B6C389a7c5C7dD473a) |
| [RioLRTAssetRegistry](./contracts/restaking/RioLRTAssetRegistry.sol)         | [0x5Cd99BF52FF21ab4E568149534f3521432e37ec0](https://goerli.etherscan.io/address/0x5Cd99BF52FF21ab4E568149534f3521432e37ec0) |
| [RioLRTOperatorRegistry](./contracts/restaking/RioLRTOperatorRegistry.sol)   | [0x8Abf8aB35915457219B801a774140f067DdB0705](https://goerli.etherscan.io/address/0x8Abf8aB35915457219B801a774140f067DdB0705) |
| [RioLRTAVSRegistry](./contracts/restaking/RioLRTAVSRegistry.sol)             | [0xB3B7d46A6946b16cE51B025A2e98e404e9aDbC4C](https://goerli.etherscan.io/address/0xB3B7d46A6946b16cE51B025A2e98e404e9aDbC4C) |
| [RioLRTDepositPool](./contracts/restaking/RioLRTDepositPool.sol)             | [0x68A79761F05ef0cAE3041e97af2021Fcd9115A32](https://goerli.etherscan.io/address/0x68A79761F05ef0cAE3041e97af2021Fcd9115A32) |
| [RioLRTWithdrawalQueue](./contracts/restaking/RioLRTWithdrawalQueue.sol)     | [0x37FdaE957cF5b3dEE819Ed84F2F99617C0B2749b](https://goerli.etherscan.io/address/0x37FdaE957cF5b3dEE819Ed84F2F99617C0B2749b) |
| [RioLRTRewardDistributor](./contracts/restaking/RioLRTRewardDistributor.sol) | [0x93d7053bd5cF07F2C80964276549EEc325f9f1fE](https://goerli.etherscan.io/address/0x93d7053bd5cF07F2C80964276549EEc325f9f1fE) |

## Contract Development

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Script

#### Deploy (Goerli)

```shell
forge script script/DeployRioIssuerGoerli.s.sol --chain 5 --rpc-url <your_rpc_url> --broadcast
```

#### Issue Restaked Ether (Goerli)

```shell
forge script script/IssueRestakedEtherGoerli.s.sol --chain 5 --rpc-url <your_rpc_url> --broadcast
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
