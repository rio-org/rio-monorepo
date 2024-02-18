// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioLRTAVSRegistry {
    /// @dev Information about an AVS.
    struct AVS {
        /// @dev A name for the AVS.
        string name;
        /// @dev Whether the AVS is active.
        bool active;
        /// @dev The address of the AVS' slashing contract.
        address slashingContract;
        /// @dev The address of the AVS' registry contract.
        address registryContract;
    }

    /// @dev Thrown when the provided name is empty.
    error INVALID_NAME();

    /// @dev Thrown when the provided slashing contract address is not `address(0)` or a contract.
    error INVALID_SLASHING_CONTRACT();

    /// @dev Thrown when the provided registry contract address is not a contract.
    error INVALID_REGISTRY_CONTRACT();

    /// @dev Thrown when attempting to activate or deactivate an AVS that is not registered.
    error AVS_NOT_REGISTERED();

    /// @dev Thrown when attempting to activate an AVS that is already active.
    error AVS_ALREADY_ACTIVE();

    /// @dev Thrown when attempting to deactivate an AVS that is already inactive.
    error AVS_ALREADY_INACTIVE();

    /// @dev Emitted when a new AVS is added to the registry.
    /// @param avsId The ID of the newly added AVS.
    /// @param name The name of the AVS.
    /// @param slashingContract The address of the slashing contract.
    /// @param registryContract The address of the registry contract.
    event AVSAdded(uint128 indexed avsId, string name, address slashingContract, address registryContract);

    /// @dev Emitted when an AVS is activated in the registry.
    /// @param avsId The ID of the activated AVS.
    event AVSActivated(uint128 indexed avsId);

    /// @dev Emitted when an AVS is deactivated in the registry.
    /// @param avsId The ID of the deactivated AVS.
    event AVSDeactivated(uint128 indexed avsId);

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token The address of the liquid restaking token.
    function initialize(address initialOwner, address token) external;

    /// @notice Returns the AVS associated with the given ID.
    /// @param avsId The ID of the AVS to retrieve.
    /// @return The AVS corresponding to the given ID.
    function getAVS(uint128 avsId) external view returns (AVS memory);

    /// @notice Checks if the provided slashing contract is active.
    /// @param slashingContract The address of the slashing contract to check.
    /// @return True if the slashing contract is active, false otherwise.
    function isActiveSlashingContract(address slashingContract) external view returns (bool);

    /// @notice Checks if the provided registry contract is active.
    /// @param registryContract The address of the registry contract to check.
    /// @return True if the registry contract is active, false otherwise.
    function isActiveRegistryContract(address registryContract) external view returns (bool);

    // forgefmt: disable-next-item
    /// @notice Adds a new AVS to the registry.
    /// @param name The name of the AVS.
    /// @param slashingContract The address of the slashing contract.
    /// @param registryContract The address of the registry contract.
    function addAVS(string calldata name, address slashingContract, address registryContract) external returns (uint128);

    /// @notice Activates an AVS in the registry.
    /// @param avsId The ID of the AVS to activate.
    function activateAVS(uint128 avsId) external;

    /// @notice Deactivates an AVS in the registry.
    /// @param avsId The ID of the AVS to deactivate.
    function deactivateAVS(uint128 avsId) external;
}
