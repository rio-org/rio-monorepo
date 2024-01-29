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
| [RioLRTIssuer](./contracts/restaking/RioLRTIssuer.sol) | [0x677a3258E9D4A5b242DA9114F14d178E295deAb5](https://goerli.etherscan.io/address/0x677a3258E9D4A5b242DA9114F14d178E295deAb5) |

#### Restaked Ether

| Contract                                                                     | Address                                                                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [RioLRT](./contracts/restaking/RioLRT.sol)                                   | [0x35C8666830fbAAA2b163C4Bc49f19b0CAc612ec0](https://goerli.etherscan.io/address/0x35C8666830fbAAA2b163C4Bc49f19b0CAc612ec0) |
| [RioLRTCoordinator](./contracts/restaking/RioLRTCoordinator.sol)             | [0xd0ad3D9e8738aD97D5Bc07cb08e125AE6151539B](https://goerli.etherscan.io/address/0xd0ad3D9e8738aD97D5Bc07cb08e125AE6151539B) |
| [RioLRTAssetRegistry](./contracts/restaking/RioLRTAssetRegistry.sol)         | [0x92C995F644AB61E2cCe0B53FebB276989D6e51a1](https://goerli.etherscan.io/address/0x92C995F644AB61E2cCe0B53FebB276989D6e51a1) |
| [RioLRTOperatorRegistry](./contracts/restaking/RioLRTOperatorRegistry.sol)   | [0x7A06094A88d4c2Bb8B58BB838821996D3562b162](https://goerli.etherscan.io/address/0x7A06094A88d4c2Bb8B58BB838821996D3562b162) |
| [RioLRTAVSRegistry](./contracts/restaking/RioLRTAVSRegistry.sol)             | [0xbc1d40c3D4d5288556bF6f952b42101b9cFB9c77](https://goerli.etherscan.io/address/0xbc1d40c3D4d5288556bF6f952b42101b9cFB9c77) |
| [RioLRTDepositPool](./contracts/restaking/RioLRTDepositPool.sol)             | [0xE325dDb63fa12D008873D454DE01e4C88d4e8Bfa](https://goerli.etherscan.io/address/0xE325dDb63fa12D008873D454DE01e4C88d4e8Bfa) |
| [RioLRTWithdrawalQueue](./contracts/restaking/RioLRTWithdrawalQueue.sol)     | [0x50aed4de7F12E6E3a34b682c31D0a3855690CbD9](https://goerli.etherscan.io/address/0x50aed4de7F12E6E3a34b682c31D0a3855690CbD9) |
| [RioLRTRewardDistributor](./contracts/restaking/RioLRTRewardDistributor.sol) | [0xfeC11c86c1365bF70218A2540da817dB6Ce70942](https://goerli.etherscan.io/address/0xfeC11c86c1365bF70218A2540da817dB6Ce70942) |

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
