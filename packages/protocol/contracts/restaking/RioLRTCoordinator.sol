// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {EIP712} from '@solady/utils/EIP712.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SignatureCheckerLib} from '@solady/utils/SignatureCheckerLib.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IETHPOSDeposit} from 'contracts/interfaces/ethereum/IETHPOSDeposit.sol';
import {ETH_ADDRESS, MAX_REBALANCE_DELAY} from 'contracts/utils/Constants.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {OperatorOperations} from 'contracts/utils/OperatorOperations.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTCoordinator is IRioLRTCoordinator, OwnableUpgradeable, UUPSUpgradeable, EIP712, RioLRTCore {
    using SafeERC20 for *;
    using Asset for *;

    /// @notice EIP-712 typehash for `DepositRoot` message
    bytes32 public constant DEPOSIT_ROOT_TYPEHASH = keccak256('DepositRoot(bytes32 root)');

    /// @notice The Ethereum POS deposit contract address.
    IETHPOSDeposit public immutable ethPOS;

    /// @notice The required delay between rebalances.
    uint24 public rebalanceDelay;

    /// @notice The guardian signer address.
    address public guardianSigner;

    /// @notice Tracks the timestamp from which each asset is eligible for rebalancing, inclusive of the defined timestamp.
    mapping(address asset => uint40 timestamp) public assetNextRebalanceAfter;

    /// @notice Require that the asset is supported, the deposit amount is non-zero, and the
    /// deposit cap has not been reached.
    /// @param asset The asset being deposited.
    /// @param amountIn The amount of the asset being deposited.
    modifier checkDeposit(address asset, uint256 amountIn) {
        _checkAssetSupported(asset);
        _checkAmountGreaterThanZero(amountIn);
        _checkDepositCapReached(asset, amountIn);
        _;
    }

    /// @notice Require that the asset is supported and the withdrawal amount is non-zero.
    /// @param asset The asset being deposited.
    /// @param amountIn The amount of the asset being deposited.
    modifier checkWithdrawal(address asset, uint256 amountIn) {
        _checkAssetSupported(asset);
        _checkAmountGreaterThanZero(amountIn);
        _;
    }

    /// @notice Require that the rebalance delay has been met.
    /// @param asset The asset being rebalanced.
    modifier checkRebalanceDelayMet(address asset) {
        _checkRebalanceDelayMet(asset);
        _;
    }

    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    /// @param ethPOS_ The Ethereum POS deposit contract address.
    constructor(address issuer_, address ethPOS_) RioLRTCore(issuer_) {
        ethPOS = IETHPOSDeposit(ethPOS_);
    }

    /// @dev Initializes the contract.
    /// @param initialOwner The owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    function initialize(address initialOwner, address token_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __RioLRTCore_init(token_);

        _setRebalanceDelay(24 hours);
    }

    /// @notice Returns the total value of all underlying assets in the unit of account.
    function getTVL() public view returns (uint256 value) {
        return assetRegistry().getTVL();
    }

    // forgefmt: disable-next-item
    /// @notice Deposits ERC20 tokens and mints restaking token(s) to the caller.
    /// @param asset The asset being deposited.
    /// @param amountIn The amount of the asset being deposited.
    /// @dev Reentrancy protection is omitted as tokens with transfer hooks are not supported.
    /// Future inclusion of such tokens could risk reentrancy attacks. Developers should remain vigilant
    /// and consider safeguards if this assumption changes.
    function deposit(address asset, uint256 amountIn) external checkDeposit(asset, amountIn) returns (uint256 amountOut) {
        // Convert deposited asset amount to restaking tokens.
        amountOut = convertFromAssetToRestakingTokens(asset, amountIn);

        // Pull tokens from the sender to the deposit pool.
        IERC20(asset).safeTransferFrom(msg.sender, address(depositPool()), amountIn);

        // Mint restaking tokens to the caller.
        token.mint(msg.sender, amountOut);

        emit Deposited(msg.sender, asset, amountIn, amountOut);
    }

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    function depositETH() external payable returns (uint256) {
        return _depositETH();
    }

    // forgefmt: disable-next-item
    /// @notice Requests a withdrawal to `asset` for `amountIn` restaking tokens.
    /// @param asset The asset being withdrawn.
    /// @param amountIn The amount of restaking tokens being redeemed.
    function requestWithdrawal(address asset, uint256 amountIn) external checkWithdrawal(asset, amountIn) returns (uint256 sharesOwed) {
        // Determine the amount of shares owed to the withdrawer using the current exchange rate.
        sharesOwed = convertToSharesFromRestakingTokens(asset, amountIn);

        // If requesting ETH, reduce the precision of the shares owed to the nearest Gwei,
        // which is the smallest unit of account supported by EigenLayer.
        if (asset == ETH_ADDRESS) sharesOwed = sharesOwed.reducePrecisionToGwei();

        // Pull restaking tokens from the sender to the withdrawal queue.
        token.safeTransferFrom(msg.sender, address(withdrawalQueue()), amountIn);

        // Ensure there are enough shares to cover the withdrawal request, and queue the withdrawal.
        uint256 availableShares = assetRegistry().convertToSharesFromAsset(asset, assetRegistry().getTotalBalanceForAsset(asset));
        if (sharesOwed > availableShares - withdrawalQueue().getSharesOwedInCurrentEpoch(asset)) {
            revert INSUFFICIENT_SHARES_FOR_WITHDRAWAL();
        }
        withdrawalQueue().queueWithdrawal(msg.sender, asset, sharesOwed, amountIn);
    }

    // forgefmt: disable-next-item
    /// @notice Rebalances ETH by processing outstanding withdrawals and depositing remaining
    /// ETH into EigenLayer.
    /// @param root The deposit merkle root.
    /// @param signature The guardian signature.
    /// @dev This function requires a guardian signature prior to depositing ETH into EigenLayer. If the
    /// guardian doesn't provide a signature within 24 hours, then the rebalance will be allowed without
    /// a signature, but only for withdrawals. In the future, this may be extended to allow a rebalance
    /// without a guardian signature without waiting 24 hours if withdrawals outnumber deposits.
    function rebalanceETH(bytes32 root, bytes calldata signature) external checkRebalanceDelayMet(ETH_ADDRESS) {
        if (!assetRegistry().isSupportedAsset(ETH_ADDRESS)) revert ASSET_NOT_SUPPORTED(ETH_ADDRESS);
        if (msg.sender != tx.origin) revert CALLER_MUST_BE_EOA();

        // If the guardian signature is verified, check if the deposit root is stale. Otherwise, check
        // the condition for a withdrawal-only rebalance.
        bool isGuardianSignatureVerified = _verifyGuardianSignature(root, signature);
        if (isGuardianSignatureVerified) {
            if (root != ethPOS.get_deposit_root()) {
                revert STALE_DEPOSIT_ROOT();
            }
        } else {
            bool isWithdrawalOnlyRebalanceAllowed = block.timestamp - assetNextRebalanceAfter[ETH_ADDRESS] >= 24 hours;
            if (!isWithdrawalOnlyRebalanceAllowed) {
                revert INVALID_GUARDIAN_SIGNATURE();
            }
        }

        // Process any outstanding withdrawals using funds from the deposit pool and EigenLayer.
        uint256 sharesOwed = withdrawalQueue().getSharesOwedInCurrentEpoch(ETH_ADDRESS);
        if (sharesOwed > 0) {
            _processUserWithdrawalsForCurrentEpoch(ETH_ADDRESS, sharesOwed);
        }

        // If the guardian signature is not verified, no rebalance should be attempted and the rebalance
        // should be considered complete, increasing the rebalance timestamp by the specified delay.
        if (!isGuardianSignatureVerified) {
            if (sharesOwed == 0) {
                revert NO_REBALANCE_NEEDED();
            }
            assetNextRebalanceAfter[ETH_ADDRESS] = uint40(block.timestamp) + rebalanceDelay;

            emit PartiallyRebalanced(ETH_ADDRESS);
            return;
        }

        // Deposit remaining ETH into EigenLayer if the guardian signature has been verified.
        (uint256 ethDeposited, bool isDepositCapped) = depositPool().depositBalanceIntoEigenLayer(ETH_ADDRESS);
        if (sharesOwed == 0 && ethDeposited == 0) {
            revert NO_REBALANCE_NEEDED();
        }
        if (ethDeposited > 0) {
            assetRegistry().increaseUnverifiedValidatorETHBalance(ethDeposited);
        }

        // When the deposit is not capped, the rebalance is considered complete, and the asset rebalance
        // timestamp is increased by the specified delay. If capped, the asset may be rebalanced again
        // immediately as there are more assets to deposit.
        if (!isDepositCapped) {
            assetNextRebalanceAfter[ETH_ADDRESS] = uint40(block.timestamp) + rebalanceDelay;
        }
        emit Rebalanced(ETH_ADDRESS);
    }

    /// @notice Rebalances the provided ERC20 `token` by processing outstanding withdrawals and
    /// depositing remaining tokens into EigenLayer.
    /// @param token The token to rebalance.
    function rebalanceERC20(address token) external checkRebalanceDelayMet(token) {
        if (!assetRegistry().isSupportedAsset(token)) revert ASSET_NOT_SUPPORTED(token);
        if (token == ETH_ADDRESS) revert INVALID_TOKEN_ADDRESS();
        if (msg.sender != tx.origin) revert CALLER_MUST_BE_EOA();

        // Process any outstanding withdrawals using funds from the deposit pool and EigenLayer.
        uint256 sharesOwed = withdrawalQueue().getSharesOwedInCurrentEpoch(token);
        if (sharesOwed > 0) {
            _processUserWithdrawalsForCurrentEpoch(token, sharesOwed);
        }

        // Deposit remaining tokens into EigenLayer.
        (uint256 sharesReceived,) = depositPool().depositBalanceIntoEigenLayer(token);
        if (sharesOwed == 0 && sharesReceived == 0) {
            revert NO_REBALANCE_NEEDED();
        }
        if (sharesReceived > 0) {
            assetRegistry().increaseSharesHeldForAsset(token, sharesReceived);
        }

        // ERC20 deposits are not currently capped, so the rebalance is considered complete.
        assetNextRebalanceAfter[token] = uint40(block.timestamp) + rebalanceDelay;

        emit Rebalanced(token);
    }

    /// @notice Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay, in seconds.
    function setRebalanceDelay(uint24 newRebalanceDelay) external onlyOwner {
        _setRebalanceDelay(newRebalanceDelay);
    }

    /// @notice Set the guardian signer address.
    /// @param newGuardianSigner The address of the new guardian signer.
    /// @dev Only callable by the owner.
    function setGuardianSigner(address newGuardianSigner) external onlyOwner {
        guardianSigner = newGuardianSigner;
        emit GuardianSignerSet(newGuardianSigner);
    }

    /// @notice Converts the unit of account value to its equivalent in restaking tokens.
    /// The unit of account is the price feed's quote asset.
    /// @param value The restaking token's value in the unit of account.
    function convertFromUnitOfAccountToRestakingTokens(uint256 value) public view returns (uint256) {
        uint256 tvl = getTVL();
        uint256 supply = token.totalSupply();

        if (supply == 0) {
            return value;
        }
        return value * supply / tvl;
    }

    /// @notice Converts an amount of restaking tokens to its equivalent value in the unit of account.
    /// The unit of account is the price feed's quote asset.
    /// @param amount The amount of restaking tokens to convert.
    function convertToUnitOfAccountFromRestakingTokens(uint256 amount) public view returns (uint256) {
        uint256 tvl = getTVL();
        uint256 supply = token.totalSupply();

        if (supply == 0) {
            return amount;
        }
        return tvl * amount / supply;
    }

    /// @notice Converts an asset amount to its equivalent value in restaking tokens.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertFromAssetToRestakingTokens(address asset, uint256 amount) public view returns (uint256) {
        uint256 value = assetRegistry().convertToUnitOfAccountFromAsset(asset, amount);
        return convertFromUnitOfAccountToRestakingTokens(value);
    }

    /// @notice Converts an amount of restaking tokens to the equivalent in the asset.
    /// @param asset The address of the asset to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToAssetFromRestakingTokens(address asset, uint256 amount) public view returns (uint256) {
        uint256 value = convertToUnitOfAccountFromRestakingTokens(amount);
        return assetRegistry().convertFromUnitOfAccountToAsset(asset, value);
    }

    /// @notice Converts an amount of restaking tokens to the equivalent in the provided
    /// asset's EigenLayer shares.
    /// @param asset The address of the asset whose EigenLayer shares to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToSharesFromRestakingTokens(address asset, uint256 amount) public view returns (uint256 shares) {
        uint256 assetAmount = convertToAssetFromRestakingTokens(asset, amount);
        return assetRegistry().convertToSharesFromAsset(asset, assetAmount);
    }

    /// @notice EIP-712 helper.
    /// @param structHash The hash of the struct.
    function hashTypedData(bytes32 structHash) external view returns (bytes32) {
        return _hashTypedData(structHash);
    }

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    receive() external payable {
        _depositETH();
    }

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    /// @dev This function assumes that the quote asset is ETH.
    function _depositETH() internal checkDeposit(ETH_ADDRESS, msg.value) returns (uint256 amountOut) {
        // Convert deposited ETH to restaking tokens and mint to the caller.
        amountOut = convertFromUnitOfAccountToRestakingTokens(msg.value);

        // Forward ETH to the deposit pool.
        address(depositPool()).transferETH(msg.value);

        // Mint restaking tokens to the caller.
        token.mint(msg.sender, amountOut);

        emit Deposited(msg.sender, ETH_ADDRESS, msg.value, amountOut);
    }

    /// @dev Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay, in seconds.
    function _setRebalanceDelay(uint24 newRebalanceDelay) internal {
        if (newRebalanceDelay > MAX_REBALANCE_DELAY) revert REBALANCE_DELAY_TOO_LONG();
        rebalanceDelay = newRebalanceDelay;

        emit RebalanceDelaySet(newRebalanceDelay);
    }

    // forgefmt: disable-next-item
    /// @dev Processes user withdrawals for the provided asset by transferring available
    /// assets from the deposit pool and queueing any remaining amount for withdrawal from
    /// EigenLayer.
    /// @param asset The asset being withdrawn.
    /// @param sharesOwed The amount of shares owed to users.
    function _processUserWithdrawalsForCurrentEpoch(address asset, uint256 sharesOwed) internal {
        IRioLRTWithdrawalQueue withdrawalQueue_ = withdrawalQueue();
        (uint256 assetsSent, uint256 sharesSent) = depositPool().transferMaxAssetsForShares(
            asset,
            sharesOwed,
            address(withdrawalQueue_)
        );
        uint256 sharesRemaining = sharesOwed - sharesSent;

        // Exit early if all pending withdrawals were paid from the deposit pool.
        if (sharesRemaining == 0) {
            withdrawalQueue_.settleCurrentEpoch(asset, assetsSent, sharesSent);
            return;
        }

        address strategy = assetRegistry().getAssetStrategy(asset);
        bytes32 aggregateRoot = OperatorOperations.queueWithdrawalFromOperatorsForUserSettlement(
            operatorRegistry(),
            strategy,
            sharesRemaining
        );
        withdrawalQueue_.queueCurrentEpochSettlement(asset, assetsSent, sharesSent, aggregateRoot);
    }

    /// @dev Returns the domain name and version for EIP-712 guardian signatures.
    function _domainNameAndVersion() internal pure override returns (string memory, string memory) {
        return ('Rio Network', '1');
    }

    /// @dev Verify EIP-712 `DepositDataRoot` signature.
    /// @param root The deposit data merkle root to verify.
    /// @param signature The guardian signature to verify.
    function _verifyGuardianSignature(bytes32 root, bytes calldata signature) internal view returns (bool) {
        bytes32 digest = _hashTypedData(keccak256(abi.encode(DEPOSIT_ROOT_TYPEHASH, root)));
        return SignatureCheckerLib.isValidSignatureNowCalldata(guardianSigner, digest, signature);
    }

    /// @dev Checks if the provided asset is supported.
    /// @param asset The address of the asset.
    function _checkAssetSupported(address asset) internal view {
        if (!assetRegistry().isSupportedAsset(asset)) revert ASSET_NOT_SUPPORTED(asset);
    }

    /// @dev Checks if the provided amount is greater than zero.
    /// @param amount The amount being checked.
    function _checkAmountGreaterThanZero(uint256 amount) internal pure {
        if (amount == 0) revert AMOUNT_MUST_BE_GREATER_THAN_ZERO();
    }

    /// @dev Checks if the deposit cap for the asset has been reached.
    /// @param asset The address of the asset.
    /// @param amountIn The amount of the asset being deposited.
    function _checkDepositCapReached(address asset, uint256 amountIn) internal view {
        IRioLRTAssetRegistry assetRegistry_ = assetRegistry();

        uint256 depositCap = assetRegistry_.getAssetDepositCap(asset);
        if (depositCap > 0) {
            uint256 existingBalance = assetRegistry_.getTotalBalanceForAsset(asset);
            if (existingBalance + amountIn > depositCap) {
                revert DEPOSIT_CAP_REACHED(asset, depositCap);
            }
        }
    }

    /// @dev Reverts if the rebalance delay has not been met.
    /// @param asset The asset being rebalanced.
    function _checkRebalanceDelayMet(address asset) internal view {
        if (block.timestamp < assetNextRebalanceAfter[asset]) revert REBALANCE_DELAY_NOT_MET();
    }

    /// @dev Allows the owner to upgrade the gateway implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
