// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {BalancerDeployer} from 'test/utils/BalancerDeployer.sol';
import {EigenLayerDeployer} from 'test/utils/EigenLayerDeployer.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
import {LidoStakedEtherWrapper} from 'contracts/wrapping/wrappers/LidoStakedEtherWrapper.sol';
import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
import {TokenWrapperFactory} from 'contracts/wrapping/TokenWrapperFactory.sol';
import {RioLRTAssetManager} from 'contracts/restaking/RioLRTAssetManager.sol';
import {RioLRTAVSRegistry} from 'contracts/restaking/RioLRTAVSRegistry.sol';
import {RioLRTOperator} from 'contracts/restaking/RioLRTOperator.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioLRTGateway} from 'contracts/restaking/RioLRTGateway.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
import {RioLRT} from 'contracts/restaking/RioLRT.sol';

abstract contract RioDeployer is BalancerDeployer, EigenLayerDeployer {
    address public constant SECURITY_COUNCIL = address(0xC0);
    address public constant BEACON_CHAIN_ETH_STRATEGY = 0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0;
    uint256 public constant MIN_SWAP_FEE = 1e12; // 0.0001%

    uint256 public constant INITIAL_RETH_CASH_BALANCE = 100 ether;
    uint256 public constant INITIAL_WETH_CASH_BALANCE = 100 ether;
    uint256 public constant INITIAL_WSTETH_CASH_BALANCE = 120 ether;

    uint64 public constant TARGET_AUM_PERCENTAGE = 0.95e18; // 95%

    RioLRTIssuer issuer;

    function deployRio() public {
        deployBalancer();
        deployEigenLayer();

        address tokenWrapperFactory = address(new TokenWrapperFactory());
        address issuerImpl = address(
            new RioLRTIssuer(
                MANAGED_POOL_FACTORY_ADDRESS,
                WETH_ADDRESS,
                address(new RioLRT()),
                address(new RioLRTGateway(tokenWrapperFactory, WETH_ADDRESS, VAULT_ADDRESS, BALANCER_QUERIES_ADDRESS)),
                address(new RioLRTAssetManager(tokenWrapperFactory, VAULT_ADDRESS, WETH_ADDRESS)),
                address(new RioLRTRewardDistributor(address(0), address(0))),
                address(
                    new RioLRTOperatorRegistry(
                        VAULT_ADDRESS,
                        address(
                            new RioLRTOperator(
                                STRATEGY_MANAGER_ADDRESS,
                                EIGEN_POD_MANAGER_ADDRESS,
                                DELEGATION_MANAGER_ADDRESS,
                                BLS_PUBLIC_KEY_COMPENDIUM_ADDRESS,
                                SLASHER_ADDRESS,
                                address(0)
                            )
                        )
                    )
                ),
                address(new RioLRTWithdrawalQueue(tokenWrapperFactory, DELEGATION_MANAGER_ADDRESS)),
                address(new RioLRTAVSRegistry())
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (address(this)))))
        );

        address _stETH = address(stETH);
        address _wstETH = address(wstETH);
        TokenWrapperFactory(tokenWrapperFactory).deployWrappers(
            _stETH, _wstETH, abi.encodePacked(type(LidoStakedEtherWrapper).creationCode, abi.encode(_stETH, _wstETH))
        );
    }

    function issueRestakedETH() public returns (IRioLRTIssuer.LRTDeployment memory d, address[] memory tokens) {
        address _rETHStratetgy = address(rETHStrategy);
        address _stETHStrategy = address(stETHStrategy);

        tokens = new address[](3);
        tokens[0] = address(rETH);
        tokens[1] = address(weth);
        tokens[2] = address(wstETH);

        _ensureAscendingOrder(tokens);

        address[] memory strategies = new address[](3);
        strategies[0] = _rETHStratetgy;
        strategies[1] = BEACON_CHAIN_ETH_STRATEGY;
        strategies[2] = _stETHStrategy;

        uint256[] memory amountsIn = new uint256[](3);
        amountsIn[0] = INITIAL_RETH_CASH_BALANCE;
        amountsIn[1] = INITIAL_WETH_CASH_BALANCE;
        amountsIn[2] = INITIAL_WSTETH_CASH_BALANCE;

        uint256[] memory normalizedWeights = new uint256[](3);
        normalizedWeights[0] = 0.3e18;
        normalizedWeights[1] = 0.3e18;
        normalizedWeights[2] = 0.4e18;

        uint64[] memory targetAUMPercentages = new uint64[](3);
        targetAUMPercentages[0] = TARGET_AUM_PERCENTAGE;
        targetAUMPercentages[1] = TARGET_AUM_PERCENTAGE;
        targetAUMPercentages[2] = TARGET_AUM_PERCENTAGE;

        // Allow the issuer to pull the tokens.
        IERC20(tokens[0]).approve(address(issuer), amountsIn[0]);
        IERC20(tokens[1]).approve(address(issuer), amountsIn[1]);
        IERC20(tokens[2]).approve(address(issuer), amountsIn[2]);

        d = issuer.issueLRT(
            'Restaked Ether',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                tokens: tokens,
                strategies: strategies,
                amountsIn: amountsIn,
                normalizedWeights: normalizedWeights,
                targetAUMPercentages: targetAUMPercentages,
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
    function _deployTo(bytes memory creationCode, bytes memory args, address where)
        internal
        override(BalancerDeployer, EigenLayerDeployer)
    {
        super._deployTo(creationCode, args, where);
    }

    /// @dev Ensure the provided addresses are in ascending order.
    /// @param addrs The addresses to check.
    function _ensureAscendingOrder(address[] memory addrs) internal pure {
        for (uint256 i = 0; i < addrs.length - 1; i++) {
            require(addrs[i] < addrs[i + 1], string.concat('RioDeployer: incorrect order at index ', vm.toString(i)));
        }
    }
}
