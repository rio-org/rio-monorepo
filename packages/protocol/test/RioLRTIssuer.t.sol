// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IManagedPoolSettings} from 'contracts/interfaces/balancer/IManagedPoolSettings.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {MockERC20} from 'test/utils/MockERC20.sol';

contract RioLRTIssuerTest is RioDeployer {
    address public constant SECURITY_COUNCIL = address(0xC0);
    uint256 public constant MIN_SWAP_FEE = 1e12; // 0.0001%

    function setUp() public {
        deployRio();
    }

    function test_issueLRT() public {
        address tokenA = address(new MockERC20('Token A', 'A'));
        address tokenB = address(new MockERC20('Token B', 'B'));

        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = IERC20(tokenA < tokenB ? tokenA : tokenB);
        tokens[1] = IERC20(tokenA < tokenB ? tokenB : tokenA);

        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 100e18;
        amountsIn[1] = 101e18;

        uint256[] memory normalizedWeights = new uint256[](2);
        normalizedWeights[0] = 0.3e18;
        normalizedWeights[1] = 0.7e18;

        // Allow the issuer to pull the tokens.
        tokens[0].approve(address(issuer), amountsIn[0]);
        tokens[1].approve(address(issuer), amountsIn[1]);

        (address pool, address controller) = issuer.issueLRT(
            'Restaked Ether',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                amountsIn: amountsIn,
                allowedLPs: new address[](0),
                securityCouncil: SECURITY_COUNCIL,
                settings: IManagedPoolSettings.ManagedPoolSettingsParams({
                    tokens: tokens,
                    normalizedWeights: normalizedWeights,
                    swapFeePercentage: MIN_SWAP_FEE,
                    swapEnabledOnStart: true,
                    mustAllowlistLPs: false,
                    managementAumFeePercentage: 0,
                    aumFeeId: uint256(IManagedPoolSettings.ProtocolFeeType.AUM)
                })
            })
        );
        assertNotEq(pool, address(0));
        assertNotEq(controller, address(0));
    }
}
