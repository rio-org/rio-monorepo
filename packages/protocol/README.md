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
| [RioLRTIssuer](./contracts/restaking/RioLRTIssuer.sol) | [0x502933537Ee5E6EBa274951502c221e7aDD0Ca70](https://goerli.etherscan.io/address/0x502933537Ee5E6EBa274951502c221e7aDD0Ca70) |

#### Restaked Ether

| Contract                                                                     | Address                                                                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [RioLRT](./contracts/restaking/RioLRT.sol)                                   | [0x3B639b49fDAc7F6E8C7de2263C225c85A92a823A](https://goerli.etherscan.io/address/0x3B639b49fDAc7F6E8C7de2263C225c85A92a823A) |
| [RioLRTCoordinator](./contracts/restaking/RioLRTCoordinator.sol)             | [0x89d2106DfB4df13879d4035c02ae99585b45745b](https://goerli.etherscan.io/address/0x89d2106DfB4df13879d4035c02ae99585b45745b) |
| [RioLRTAssetRegistry](./contracts/restaking/RioLRTAssetRegistry.sol)         | [0x2e5e76D221BD0AEFE7169382443Ddf487788CC32](https://goerli.etherscan.io/address/0x2e5e76D221BD0AEFE7169382443Ddf487788CC32) |
| [RioLRTOperatorRegistry](./contracts/restaking/RioLRTOperatorRegistry.sol)   | [0xaEc50d7Dfa361C940A394e10c085c5133b3793A0](https://goerli.etherscan.io/address/0xaEc50d7Dfa361C940A394e10c085c5133b3793A0) |
| [RioLRTAVSRegistry](./contracts/restaking/RioLRTAVSRegistry.sol)             | [0x5d38093409340563f5c0f9aC7ff158CB007805dC](https://goerli.etherscan.io/address/0x5d38093409340563f5c0f9aC7ff158CB007805dC) |
| [RioLRTDepositPool](./contracts/restaking/RioLRTDepositPool.sol)             | [0xD8436886C36b9e42b509B4d9b067E6C66962EA5b](https://goerli.etherscan.io/address/0xD8436886C36b9e42b509B4d9b067E6C66962EA5b) |
| [RioLRTWithdrawalQueue](./contracts/restaking/RioLRTWithdrawalQueue.sol)     | [0xC14A5eC84E58828AE93b8bf94ecba934CD7782DB](https://goerli.etherscan.io/address/0xC14A5eC84E58828AE93b8bf94ecba934CD7782DB) |
| [RioLRTRewardDistributor](./contracts/restaking/RioLRTRewardDistributor.sol) | [0x1a3127423af4f23cec95b770CfDb63440f2a43A4](https://goerli.etherscan.io/address/0x1a3127423af4f23cec95b770CfDb63440f2a43A4) |

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
