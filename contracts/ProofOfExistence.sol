pragma solidity ^0.4.24;

contract ProofOfExistence {

    mapping(bytes32 => uint) proofs;
    mapping(bytes32 => bytes32) tags;

    function createProof(bytes32 _item, bytes32 _tags) {
        require (proofs[_item] == 0);
        proofs[_item] = block.number;
        tags[_item] = _tags;
        emit LogProof(_item, block.number);
    }

    function checkProof(bytes32 _item) constant returns (uint) {
        emit CheckProof(_item, proofs[_item]);
        return proofs[_item];
    }

    event LogProof(bytes32 _item, uint _blockNumber);

    event CheckProof(bytes32 _item, uint _blockNumber);
}
