pragma solidity ^0.8.16;

import "./AttestationPublisher.sol";

import "hardhat/console.sol";

contract MockAttestationStation is IAttester {
    mapping(address => mapping(bytes32 => bytes)) _attestations;

    function attest(
        address _about,
        bytes32 _key,
        bytes memory _vals
    ) external {
        _attestations[_about][_key] = _vals;
        console.log("key", uint256(_key));

        emit AttestationCreated(msg.sender, _about, _key, _vals);
    }

    function getAttestation(address _about, bytes32 _key)
        public
        view
        returns (bytes memory)
    {
        return _attestations[_about][_key];
    }
}
