pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title A proof of existence contract that stores decoded IPFS path and tags along with a timestamp as immutable records.
 */
contract ProofOfExistence is Ownable{

    /**
     * @dev Sets the caller as the owner of the contract.
     */
    constructor ()
    {
        owner = msg.sender;
    }

    address public owner;
    bool public stopped = false;

    modifier onlyOwner {
        require(owner == msg.sender, "Caller should be the owner.");
        _;
    }

    modifier onlyWhenNotStopped {
        require(stopped == false, "Emergency stop. Cant execute this now. Restore from emergency to continue.");
        _;
    }

    uint[] public timestamps;

    mapping(uint => bytes32) public idToHash;
    mapping(bytes32 => uint) public hashToTimestamp;
    mapping(bytes32 => string) public hashToTags;
    mapping(address => uint[]) public userToIds;

    /**
     * @dev Timestamps and saves to registry. Records are immutable thus they can be proofs of existence.
     * @param _hash Decoded IPFS path. To btain the original IPFS path add "1220" as a prefix and encode to base 58.
     * @param _tags Tags as additional details to content.
     */
    function timestamp(bytes32 _hash, string _tags) onlyWhenNotStopped public returns (uint) {
        uint previousTimestamp = hashToTimestamp[_hash];
        require (previousTimestamp == 0, 'This hash is already timestamped.');
        uint id = timestamps.push(block.timestamp) -1;

        idToHash[id] = _hash;
        hashToTimestamp[_hash] = timestamps[id];
        hashToTags[_hash] = _tags;
        userToIds[msg.sender].push(id);

        return id;
    }

    /**
     * @dev Getter function for retrieving all IDs that belongs to given user at once.
     * @param user address for querying IDs
     */
    function getAllIds(address user) public constant returns (uint256[]) {
        return userToIds[user];
    }

    /**
     * @dev Stopping function of the Emergency Stop pattern. Disables the timestamp function.
     */
    function emergencyStop() onlyOwner public {
        stopped = true;
    }

    /**
     * @dev Restoring function of the Emergency Stop pattern. Enables the timestamp function.
     */
    function restoreFromEmergency() onlyOwner public {
        stopped = false;
    }

}
