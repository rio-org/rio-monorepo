// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {EigenLayerDeployer} from 'test/utils/EigenLayerDeployer.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
import {RioLRTOperatorDelegator} from 'contracts/restaking/RioLRTOperatorDelegator.sol';
import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {BEACON_CHAIN_STRATEGY, ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {RioLRTAssetRegistry} from 'contracts/restaking/RioLRTAssetRegistry.sol';
import {CredentialsProofs} from 'test/utils/beacon-chain/MockBeaconChain.sol';
import {RioLRTCoordinator} from 'contracts/restaking/RioLRTCoordinator.sol';
import {RioLRTDepositPool} from 'contracts/restaking/RioLRTDepositPool.sol';
import {RioLRTAVSRegistry} from 'contracts/restaking/RioLRTAVSRegistry.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
import {MockPriceFeed} from 'test/utils/MockPriceFeed.sol';
import {RioLRT} from 'contracts/restaking/RioLRT.sol';
import {TestUtils} from 'test/utils/TestUtils.sol';

abstract contract RioDeployer is EigenLayerDeployer {
    struct TestLRTDeployment {
        IERC20 token;
        RioLRTCoordinator coordinator;
        RioLRTAssetRegistry assetRegistry;
        RioLRTOperatorRegistry operatorRegistry;
        RioLRTAVSRegistry avsRegistry;
        RioLRTDepositPool depositPool;
        RioLRTWithdrawalQueue withdrawalQueue;
        RioLRTRewardDistributor rewardDistributor;
    }

    RioLRTIssuer issuer;

    function deployRio() public {
        deployEigenLayer();

        address issuerImpl = address(
            new RioLRTIssuer(
                address(new RioLRT()),
                address(new RioLRTCoordinator()),
                address(new RioLRTAssetRegistry()),
                address(
                    new RioLRTOperatorRegistry(
                        address(this),
                        address(
                            new RioLRTOperatorDelegator(
                                STRATEGY_MANAGER_ADDRESS, EIGEN_POD_MANAGER_ADDRESS, DELEGATION_MANAGER_ADDRESS
                            )
                        )
                    )
                ),
                address(new RioLRTAVSRegistry()),
                address(new RioLRTDepositPool()),
                address(new RioLRTWithdrawalQueue(DELEGATION_MANAGER_ADDRESS)),
                address(new RioLRTRewardDistributor())
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (address(this)))))
        );
    }

    // forgefmt: disable-next-item
    function issueRestakedETH() public returns (TestLRTDeployment memory td, IRioLRTAssetRegistry.AssetConfig[] memory assets) {
        assets = new IRioLRTAssetRegistry.AssetConfig[](1);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: ETH_ADDRESS,
            depositCap: 1_000 ether,
            priceFeed: address(0),
            strategy: BEACON_CHAIN_STRATEGY
        });

        IRioLRTIssuer.LRTDeployment memory deployment = issuer.issueLRT(
            'Restaked Ether',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this)
            })
        );
        td = TestLRTDeployment({
            token: IERC20(deployment.token),
            coordinator: RioLRTCoordinator(payable(deployment.coordinator)),
            assetRegistry: RioLRTAssetRegistry(deployment.assetRegistry),
            operatorRegistry: RioLRTOperatorRegistry(deployment.operatorRegistry),
            avsRegistry: RioLRTAVSRegistry(deployment.avsRegistry),
            depositPool: RioLRTDepositPool(payable(deployment.depositPool)),
            withdrawalQueue: RioLRTWithdrawalQueue(payable(deployment.withdrawalQueue)),
            rewardDistributor: RioLRTRewardDistributor(payable(deployment.rewardDistributor))
        });
    }

    // forgefmt: disable-next-item
    function issueRestakedLST() public returns (TestLRTDeployment memory td, IRioLRTAssetRegistry.AssetConfig[] memory assets) {
        assets = new IRioLRTAssetRegistry.AssetConfig[](2);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: address(rETH),
            depositCap: 1_000 ether,
            priceFeed: address(new MockPriceFeed(1.0961 ether)),
            strategy: RETH_STRATEGY
        });
        assets[1] = IRioLRTAssetRegistry.AssetConfig({
            asset: address(stETH),
            depositCap: 1_000 ether,
            priceFeed: address(new MockPriceFeed(0.9995 ether)),
            strategy: STETH_STRATEGY
        });

        IRioLRTIssuer.LRTDeployment memory deployment = issuer.issueLRT(
            'Restaked LSTs',
            'reLST',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this)
            })
        );
        td = TestLRTDeployment({
            token: IERC20(deployment.token),
            coordinator: RioLRTCoordinator(payable(deployment.coordinator)),
            assetRegistry: RioLRTAssetRegistry(deployment.assetRegistry),
            operatorRegistry: RioLRTOperatorRegistry(deployment.operatorRegistry),
            avsRegistry: RioLRTAVSRegistry(deployment.avsRegistry),
            depositPool: RioLRTDepositPool(payable(deployment.depositPool)),
            withdrawalQueue: RioLRTWithdrawalQueue(payable(deployment.withdrawalQueue)),
            rewardDistributor: RioLRTRewardDistributor(payable(deployment.rewardDistributor))
        });
    }

    function addOperatorDelegators(RioLRTOperatorRegistry operatorRegistry, address rewardDistributor, uint8 count)
        public
    {
        IRioLRTOperatorRegistry.StrategyShareCap[] memory shareCaps = new IRioLRTOperatorRegistry.StrategyShareCap[](2);
        shareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: STETH_STRATEGY, cap: 1_000 ether});
        shareCaps[1] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: RETH_STRATEGY, cap: 1_000 ether});
        uint40 validatorCap = 100;

        addOperatorDelegators(operatorRegistry, rewardDistributor, count, shareCaps, validatorCap);
    }

    function addOperatorDelegators(
        RioLRTOperatorRegistry operatorRegistry,
        address rewardDistributor,
        uint8 count,
        IRioLRTOperatorRegistry.StrategyShareCap[] memory shareCaps,
        uint40 validatorCap
    ) public {
        // Stub Ethereum POS deposits
        vm.mockCall(
            ETH_POS_ADDRESS,
            abi.encodeWithSelector(0x22895118), // deposit(bytes,bytes,bytes,bytes32)
            new bytes(0)
        );

        (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(validatorCap);
        for (uint8 i = 0; i < count; i++) {
            address operator = address(uint160(i + 1));
            string memory metadataURI =
                'https://ipfs.io/ipfs/bafkreiaps6k6yapebk2eac2kgh47ktv2dxsajtssyi5fgnkrhyu7spivye';

            vm.prank(operator);
            delegationManager.registerAsOperator(
                IDelegationManager.OperatorDetails({
                    earningsReceiver: rewardDistributor,
                    delegationApprover: address(0),
                    stakerOptOutWindowBlocks: 0
                }),
                metadataURI
            );

            (uint8 operatorId,) = operatorRegistry.addOperator(
                operator, address(this), address(this), metadataURI, shareCaps, validatorCap
            );
            operatorRegistry.addValidatorDetails(operatorId, validatorCap, publicKeys, signatures);
        }

        // Fast forward to allow validator keys time to confirm.
        skip(operatorRegistry.validatorKeyReviewPeriod());
    }

    function verifyCredentialsForValidators(
        RioLRTOperatorRegistry operatorRegistry,
        uint8 operatorId,
        uint8 validatorCount
    ) public {
        IRioLRTOperatorRegistry.OperatorPublicDetails memory details = operatorRegistry.getOperatorDetails(operatorId);
        bytes32 withdrawalCredentials = RioLRTOperatorDelegator(details.operatorContract).withdrawalCredentials();

        beaconChain.setNextTimestamp(block.timestamp);
        for (uint8 i = 0; i < validatorCount; i++) {
            (, CredentialsProofs memory proofs) = beaconChain.newValidator({
                balanceWei: 32 ether,
                withdrawalCreds: abi.encodePacked(withdrawalCredentials)
            });

            vm.prank(details.manager);
            operatorRegistry.verifyWithdrawalCredentials(
                operatorId,
                proofs.oracleTimestamp,
                proofs.stateRootProof,
                proofs.validatorIndices,
                proofs.validatorFieldsProofs,
                proofs.validatorFields
            );
        }
    }
}
