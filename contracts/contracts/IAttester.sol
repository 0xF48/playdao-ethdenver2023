pragma solidity ^0.8.16;

// interface of AttestationStation by Optimism
struct AttestationData {
    address about;
    bytes32 key;
    bytes val;
}

interface IAttester {
    function attest(
        address _about,
        bytes32 _key,
        bytes memory _vals
    ) external;
}
