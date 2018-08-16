  pragma solidity ^0.4.24;

contract ProofOfExistence {
    uint[] public proofRegisty; //TODO Orthogonalize this

    mapping(bytes32 => uint) hashToBlockNumber;
    mapping(bytes32 => bytes32) hashToTags;
    mapping(uint => bytes32) idToHash;
    mapping(address => uint[]) userToRegistrySubset;

    function createProof(bytes32 _itemHash, bytes32 _tags) {
        require (hashToBlockNumber[_itemHash] == 0, 'This item is already in the registry');
        hashToBlockNumber[_itemHash] = block.number;
        hashToTags[_itemHash] = _tags;
        uint index = proofRegisty.push(itemHash) -1;
        emit LogProof(_itemHash, block.number);
    }

    function checkProof(bytes32 _item) constant returns (uint) {
        emit CheckProof(_item, proofs[_item]);
        return proofs[_item];
    }

    event LogProof(bytes32 _item, uint _blockNumber);

    event CheckProof(bytes32 _item, uint _blockNumber);
}
