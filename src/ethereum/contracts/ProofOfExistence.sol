  pragma solidity ^0.4.24;

contract ProofOfExistence {
    uint[] public timestamps;

    mapping(uint => bytes32) public idToHash;
    mapping(bytes32 => uint) public hashToTimestamp;
    mapping(bytes32 => bytes32) public hashToTags;
    mapping(address => uint[]) public userToIds;

    function timestamp(bytes32 _hash, bytes32 _tags) returns (uint) {
        require (getTimestamp(_hash) == 0, 'This hash is already timestamped.');
        uint id = timestamps.push(block.timestamp) -1;

        idToHash[id] = _hash;
        hashToTimestamp[_hash] = timestamps[id];
        hashToTags[_hash] = _tags;
        userToIds[msg.sender].push(id);

        return id;
    }

    function getTimestamp(bytes32 _hash) constant returns (uint) {
        return hashToTimestamp[_hash];
    }



    event LogProof(bytes32 _item, uint _blockNumber);

    event CheckProof(bytes32 _item, uint _blockNumber);
}
