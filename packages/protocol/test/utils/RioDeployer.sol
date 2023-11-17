// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {BalancerDeployer} from 'test/utils/BalancerDeployer.sol';
import {EigenLayerDeployer} from 'test/utils/EigenLayerDeployer.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
import {RioLRTAssetManager} from 'contracts/restaking/RioLRTAssetManager.sol';
import {RioLRTController} from 'contracts/restaking/RioLRTController.sol';
import {RioLRTOperator} from 'contracts/restaking/RioLRTOperator.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
import {RioLRT} from 'contracts/restaking/RioLRT.sol';

abstract contract RioDeployer is BalancerDeployer, EigenLayerDeployer {
    address public constant SECURITY_COUNCIL = address(0xC0);
    uint256 public constant MIN_SWAP_FEE = 1e12; // 0.0001%

    RioLRTIssuer issuer;

    function deployRio() public {
        deployBalancer();
        deployEigenLayer();

        address issuerImpl = address(
            new RioLRTIssuer(
                MANAGED_POOL_FACTORY_ADDRESS,
                WETH_ADDRESS,
                address (new RioLRT(VAULT_ADDRESS, BALANCER_QUERIES_ADDRESS)),
                address (new RioLRTController()),
                address (new RioLRTAssetManager(VAULT_ADDRESS, WETH_ADDRESS)),
                address (new RioLRTRewardDistributor(address(0), address(0))),
                address (new RioLRTOperatorRegistry(
                    VAULT_ADDRESS,
                    address(
                        new RioLRTOperator(
                            STRATEGY_MANAGER_ADDRESS,
                            EIGEN_POD_MANAGER_ADDRESS,
                            DELEGATION_MANAGER_ADDRESS,
                            SLASHER_ADDRESS,
                            address(0)
                        )
                    )
                )),
                address (new RioLRTWithdrawalQueue(DELEGATION_MANAGER_ADDRESS, VAULT_ADDRESS))
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (address(this)))))
        );
    }

    function issueRestakedETH() public returns (IRioLRTIssuer.LRTDeployment memory d, address[] memory tokens) {
        tokens = new address[](2);
        tokens[0] = address(stETH < rETH ? stETH : rETH);
        tokens[1] = address(stETH < rETH ? rETH : stETH);

        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 30e18;
        amountsIn[1] = 71e18;

        uint256[] memory normalizedWeights = new uint256[](2);
        normalizedWeights[0] = 0.3e18;
        normalizedWeights[1] = 0.7e18;

        // Allow the issuer to pull the tokens.
        IERC20(tokens[0]).approve(address(issuer), amountsIn[0]);
        IERC20(tokens[1]).approve(address(issuer), amountsIn[1]);

        d = issuer.issueLRT(
            'Restaked Ether',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                tokens: tokens,
                amountsIn: amountsIn,
                normalizedWeights: normalizedWeights,
                swapFeePercentage: MIN_SWAP_FEE,
                managementAumFeePercentage: 0,
                swapEnabledOnStart: true,
                securityCouncil: SECURITY_COUNCIL
            })
        );
    }

    /// @dev Deploys a contract to the specified address.
    /// @param creationCode The contract creation code.
    /// @param args The contract constructor arguments.
    /// @param where The address to deploy the contract to.
    function _deployTo(bytes memory creationCode, bytes memory args, address where) internal override(BalancerDeployer, EigenLayerDeployer) {
        super._deployTo(creationCode, args, where);
    }
}
