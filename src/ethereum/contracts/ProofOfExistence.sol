pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract ProofOfExistence is Ownable{

    constructor ()
    {
        owner = msg.sender;
    }

    address public owner;
    bool public stopped = false;

    modifier onlyOwner {
        require(owner == msg.sender, "msg.sender should be the owner.");
        _;
    }

    modifier onlyWhenNotStopped {
        require(stopped == false, "Cant run when stopped.");
        _;
    }

    uint[] public timestamps;

    mapping(uint => bytes32) public idToHash;
    mapping(bytes32 => uint) public hashToTimestamp;
    mapping(bytes32 => string) public hashToTags;
    mapping(address => uint[]) public userToIds;

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

    function getAllIds(address user) public constant returns (uint256[]) {
        return userToIds[user];
    }

    function emergencyStop() onlyOwner public {
        stopped = true;
    }

    function restoreFromEmergency() onlyOwner public {
        stopped = false;
    }

}
