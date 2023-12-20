// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTAVSRegistry} from 'contracts/interfaces/IRioLRTAVSRegistry.sol';

contract RioLRTAVSRegistry is IRioLRTAVSRegistry, OwnableUpgradeable, UUPSUpgradeable {
    /// @notice The number of AVS in the registry (all-time).
    uint128 public avsCount;

    /// @notice The number of active AVS in the registry.
    uint128 public activeAVSCount;

    /// @dev Mapping of an AVS' ID to its name, slashing contract, and registry contract.
    mapping(uint128 => AVS) private _avs;

    /// @dev Whether a slashing contract is active.
    mapping(address => bool) private _isActiveSlashingContract;

    /// @dev Whether a registry contract is active.
    mapping(address => bool) private _isActiveRegistryContract;

    /// @dev Prevent any future reinitialization.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);
    }

    /// @notice Returns the AVS with the given ID.
    /// @param avsId The ID of the AVS.
    function getAVS(uint128 avsId) external view returns (AVS memory) {
        return _avs[avsId];
    }

    /// @notice Whether the provived `slashingContract` is active.
    /// @param slashingContract The slashing contract address.
    function isActiveSlashingContract(address slashingContract) external view returns (bool) {
        return _isActiveSlashingContract[slashingContract];
    }

    /// @notice Whether the provived `registryContract` is active.
    /// @param registryContract The registry contract address.
    function isActiveRegistryContract(address registryContract) external view returns (bool) {
        return _isActiveRegistryContract[registryContract];
    }

    /// @notice Adds a new AVS to the registry.
    /// @param name The name of the AVS.
    /// @param slashingContract The slashing contract address.
    /// @param registryContract The registry contract address.
    function addAVS(string calldata name, address slashingContract, address registryContract) external onlyOwner {
        if (bytes(name).length == 0) revert INVALID_NAME();
        if (slashingContract != address(0) && slashingContract.code.length == 0) revert INVALID_SLASHING_CONTRACT();
        if (registryContract.code.length == 0) revert INVALID_REGISTRY_CONTRACT();

        uint128 avsId = ++avsCount;
        activeAVSCount += 1;

        AVS storage avs = _avs[avsId];
        avs.name = name;
        avs.active = true;
        avs.slashingContract = slashingContract;
        avs.registryContract = registryContract;

        if (slashingContract != address(0)) {
            _isActiveSlashingContract[slashingContract] = true;
        }
        _isActiveRegistryContract[registryContract] = true;

        emit AVSAdded(avsId, name, slashingContract, registryContract);
    }

    /// @notice Activates an AVS in the registry, allowing operators to opt-in
    /// to its slashing contract and call its registry contract.
    /// @param avsId The ID of the AVS.
    function activateAVS(uint128 avsId) external onlyOwner {
        AVS memory avs = _avs[avsId];
        if (avs.registryContract == address(0)) revert AVS_NOT_REGISTERED();
        if (avs.active) revert AVS_ALREADY_ACTIVE();

        activeAVSCount += 1;

        _avs[avsId].active = true;
        if (avs.slashingContract != address(0)) {
            _isActiveSlashingContract[avs.slashingContract] = true;
        }
        _isActiveRegistryContract[avs.registryContract] = true;

        emit AVSActivated(avsId);
    }

    /// @notice Deactivates an AVS in the registry, preventing operators from
    /// opting-in to its slashing contract and calling its registry contract.
    /// @param avsId The ID of the AVS.
    function deactivateAVS(uint128 avsId) external {
        AVS memory avs = _avs[avsId];
        if (avs.registryContract == address(0)) revert AVS_NOT_REGISTERED();
        if (!avs.active) revert AVS_ALREADY_INACTIVE();

        activeAVSCount -= 1;

        _avs[avsId].active = false;
        if (avs.slashingContract != address(0)) {
            _isActiveSlashingContract[avs.slashingContract] = false;
        }
        _isActiveRegistryContract[avs.registryContract] = false;

        emit AVSDeactivated(avsId);
    }

    /// @dev Allows the owner to upgrade the asset manager implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
