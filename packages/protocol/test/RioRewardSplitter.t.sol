// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {RioRewardSplitter} from 'contracts/utils/RioRewardSplitter.sol';
import {IRioRewardSplitter} from 'contracts/interfaces/splits/IRioRewardSplitter.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {MockERC20} from 'test/utils/MockERC20.sol';
import {Asset} from 'contracts/utils/Asset.sol';
import {Vm} from 'forge-std/Vm.sol';

contract RioRewardSplitterTest is RioDeployer {
    using Asset for *;

    TestLRTDeployment public reETH;
    RioRewardSplitter public rewardSplitter;
    MockERC20 public mockERC20;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        mockERC20 = new MockERC20('Mock', 'MCK');

        address impl = address(new RioRewardSplitter(address(issuer)));
        rewardSplitter = RioRewardSplitter(
            payable(
                address(
                    new ERC1967Proxy(
                        impl, abi.encodeCall(IRioRewardSplitter.initialize, (address(this), address(reETH.token)))
                    )
                )
            )
        );
    }

    function testFuzz_calculatesUndistributedEth(uint160 addressSeed, uint8 operatorCount, uint256 amount) public {
        addOperatorsAndSendEth(addressSeed, operatorCount, amount);
        assertEq(rewardSplitter.getUndistributedETHBalance(), amount);
        rewardSplitter.distributeETH();
        assertEq(rewardSplitter.getUndistributedETHBalance(), 0);
    }

    function testFuzz_calculatesUndistributedErc20(uint160 addressSeed, uint8 operatorCount, uint256 amount) public {
        addOperatorsAndSendErc20(addressSeed, operatorCount, amount);
        assertEq(rewardSplitter.getUndistributedERC20Balance(address(mockERC20)), amount);
        rewardSplitter.distributeERC20(address(mockERC20));
        assertEq(rewardSplitter.getUndistributedERC20Balance(address(mockERC20)), 0);
    }

    function testFuzz_calculateUndistributedEthShares(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendEth(addressSeed, operatorCount, amount);
        for (uint8 i = 0; i < operatorIds.length; i++) {
            assertWithinOne(rewardSplitter.getOperatorsUndistributedETHShare(operatorIds[i]), amount / operatorCount);
        }
    }

    function testFuzz_calculateUndistributedErc20Shares(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendErc20(addressSeed, operatorCount, amount);
        for (uint8 i = 0; i < operatorIds.length; i++) {
            assertWithinOne(
                rewardSplitter.getOperatorsUndistributedERC20Share(operatorIds[i], address(mockERC20)),
                amount / operatorCount
            );
        }
    }

    function testFuzz_distributeEthToOperators(uint160 addressSeed, uint8 operatorCount, uint256 amount) public {
        uint8[] memory operatorIds = addOperatorsAndSendEth(addressSeed, operatorCount, amount);
        rewardSplitter.distributeETH();
        for (uint8 i = 0; i < operatorIds.length; i++) {
            assertWithinOne(rewardSplitter.getOperatorETHBalance(operatorIds[i]), amount / operatorCount);
        }
    }

    function testFuzz_distributeErc20ToOperators(uint160 addressSeed, uint8 operatorCount, uint256 amount) public {
        uint8[] memory operatorIds = addOperatorsAndSendErc20(addressSeed, operatorCount, amount);
        rewardSplitter.distributeERC20(address(mockERC20));
        for (uint8 i = 0; i < operatorIds.length; i++) {
            assertWithinOne(
                rewardSplitter.getOperatorERC20Balance(operatorIds[i], address(mockERC20)), amount / operatorCount
            );
        }
    }

    function testFuzz_withdrawDistributedEthCorrectly(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendEth(addressSeed, operatorCount, amount);
        rewardSplitter.distributeETH();

        for (uint8 i = 0; i < operatorIds.length; i++) {
            uint256 operatorBalance = rewardSplitter.getOperatorETHBalance(operatorIds[i]);
            address earningsReceiver = getEarningsReceiver(operatorIds[i]);

            vm.prank(earningsReceiver);
            rewardSplitter.withdrawETH(operatorIds[i]);
            assertWithinOne(earningsReceiver.balance, operatorBalance);
            vm.stopPrank();
        }
    }

    function testFuzz_withdrawDistributedErc20Correctly(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendErc20(addressSeed, operatorCount, amount);
        rewardSplitter.distributeERC20(address(mockERC20));

        for (uint8 i = 0; i < operatorIds.length; i++) {
            uint256 operatorBalance = rewardSplitter.getOperatorERC20Balance(operatorIds[i], address(mockERC20));
            address earningsReceiver = getEarningsReceiver(operatorIds[i]);

            vm.prank(earningsReceiver);
            rewardSplitter.withdrawERC20(operatorIds[i], address(mockERC20));
            assertWithinOne(mockERC20.balanceOf(earningsReceiver), operatorBalance);
            vm.stopPrank();
        }
    }

    function test_distributingEthBeforeOperatorsAdded_Reverts() public {
        address(rewardSplitter).transferETH(10 ether);
        vm.expectRevert(abi.encodeWithSelector(IRioRewardSplitter.NO_ACTIVE_OPERATORS.selector));
        rewardSplitter.distributeETH();
    }

    function test_distributingErc20BeforeOperatorsAdded_Reverts() public {
        mockERC20.mint(address(rewardSplitter), 10 ether);
        vm.expectRevert(abi.encodeWithSelector(IRioRewardSplitter.NO_ACTIVE_OPERATORS.selector));
        rewardSplitter.distributeERC20(address(mockERC20));
    }

    function test_distributingEthBeforeFundsAdded_Reverts() public {
        addOperators(1, 10);
        vm.expectRevert(abi.encodeWithSelector(IRioRewardSplitter.NO_UNDISTRIBUTED_BALANCE.selector, (ETH_ADDRESS)));
        rewardSplitter.distributeETH();
    }

    function test_distributingErc20BeforeFundsAdded_Reverts() public {
        addOperators(1, 10);
        vm.expectRevert(
            abi.encodeWithSelector(IRioRewardSplitter.NO_UNDISTRIBUTED_BALANCE.selector, (address(mockERC20)))
        );
        rewardSplitter.distributeERC20(address(mockERC20));
    }

    function testFuzz_withdrawingEthWithoutBalance_Reverts(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendEth(addressSeed, operatorCount, amount);
        rewardSplitter.distributeETH();
        for (uint8 i = 0; i < operatorIds.length; i++) {
            vm.prank(getEarningsReceiver(operatorIds[i]));
            rewardSplitter.withdrawETH(operatorIds[i]);
            vm.stopPrank();
            vm.prank(getEarningsReceiver(operatorIds[i]));
            vm.expectRevert(
                abi.encodeWithSelector(IRioRewardSplitter.OPERATOR_HAS_NO_TOKENS.selector, operatorIds[i], ETH_ADDRESS)
            );
            rewardSplitter.withdrawETH(operatorIds[i]);
            vm.stopPrank();
        }
    }

    function testFuzz_withdrawingErc20WithoutBalance_Reverts(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendErc20(addressSeed, operatorCount, amount);
        rewardSplitter.distributeERC20(address(mockERC20));
        for (uint8 i = 0; i < operatorIds.length; i++) {
            vm.prank(getEarningsReceiver(operatorIds[i]));
            rewardSplitter.withdrawERC20(operatorIds[i], address(mockERC20));
            vm.stopPrank();
            vm.prank(getEarningsReceiver(operatorIds[i]));
            vm.expectRevert(
                abi.encodeWithSelector(
                    IRioRewardSplitter.OPERATOR_HAS_NO_TOKENS.selector, operatorIds[i], address(mockERC20)
                )
            );
            rewardSplitter.withdrawERC20(operatorIds[i], address(mockERC20));
            vm.stopPrank();
        }
    }

    function testFuzz_withdrawingEthFromNotEarningsReceiver(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendEth(addressSeed, operatorCount, amount);
        rewardSplitter.distributeETH();
        for (uint8 i = 0; i < operatorIds.length; i++) {
            uint256 operatorBalance = rewardSplitter.getOperatorETHBalance(operatorIds[i]);
            address notEarner = calculateSeededAddress(addressSeed, i + 1);
            vm.prank(notEarner);
            rewardSplitter.withdrawETH(operatorIds[i]);
            vm.stopPrank();
            assertWithinOne(getEarningsReceiver(operatorIds[i]).balance, operatorBalance);
        }
    }

    function testFuzz_withdrawingErc20FromNotEarningsReceiver(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        public
    {
        uint8[] memory operatorIds = addOperatorsAndSendErc20(addressSeed, operatorCount, amount);
        rewardSplitter.distributeERC20(address(mockERC20));

        for (uint8 i = 0; i < operatorIds.length; i++) {
            uint256 operatorBalance = rewardSplitter.getOperatorERC20Balance(operatorIds[i], address(mockERC20));
            address notEarner = calculateSeededAddress(addressSeed, i + 1);
            vm.prank(notEarner);
            rewardSplitter.withdrawERC20(operatorIds[i], address(mockERC20));
            vm.stopPrank();
            assertWithinOne(mockERC20.balanceOf(getEarningsReceiver(operatorIds[i])), operatorBalance);
        }
    }

    function addOperatorsAndSendEth(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        internal
        returns (uint8[] memory operatorIds)
    {
        vm.assume(operatorCount > 1 && operatorCount <= 20);
        vm.assume(amount > operatorCount && amount < 1_000 ether);
        operatorIds = addOperators(addressSeed, operatorCount);
        address(rewardSplitter).transferETH(amount);
    }

    function addOperatorsAndSendErc20(uint160 addressSeed, uint8 operatorCount, uint256 amount)
        internal
        returns (uint8[] memory operatorIds)
    {
        vm.assume(operatorCount > 1 && operatorCount <= 20);
        vm.assume(amount > operatorCount && amount < 1_000 ether);
        operatorIds = addOperators(addressSeed, operatorCount);
        mockERC20.mint(address(rewardSplitter), amount);
    }

    function assertWithinOne(uint256 a, uint256 b) internal {
        uint256 diff = a > b ? a - b : b - a;
        if (a != b) assertEq(diff, 1);
        else assertEq(diff, 0);
    }

    function getEarningsReceiver(uint8 operatorId) internal view returns (address) {
        return reETH.operatorRegistry.getOperatorDetails(operatorId).earningsReceiver;
    }

    function addOperators(uint160 addressSeed, uint8 operatorCount) internal returns (uint8[] memory operatorIds) {
        operatorIds = addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), operatorCount);

        for (uint160 i = 0; i < operatorIds.length; i++) {
            reETH.operatorRegistry.setOperatorEarningsReceiver(operatorIds[i], calculateSeededAddress(addressSeed, i));
        }
    }

    function calculateSeededAddress(uint160 seed, uint160 nonce) internal pure returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked((uint256(seed) + nonce))))));
    }
}
