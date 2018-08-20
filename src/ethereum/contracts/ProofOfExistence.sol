pragma solidity ^0.4.24;

contract ProofOfExistence {
    uint[] public timestamps;

    mapping(uint => bytes32) public idToHash;
    mapping(bytes32 => uint) public hashToTimestamp;
    mapping(bytes32 => bytes32) public hashToTags;
    mapping(address => uint[]) public userToIds;

    function timestamp(bytes32 _hash, bytes32 _tags) public returns (uint) {
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

}
