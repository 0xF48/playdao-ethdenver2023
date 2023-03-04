pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "solidity-json-writer/contracts/JsonWriter.sol";
import "./PlayDAO.sol";

interface IAttester {
    function attest(
        address _about,
        bytes32 _key,
        bytes memory _vals
    ) external;

    event AttestationCreated(
        address indexed creator,
        address indexed about,
        bytes32 indexed key,
        bytes val
    );
}

contract AttestationPublisher is Initializable, AccessControlUpgradeable {
    using JsonWriter for JsonWriter.Json;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE");

    string public constant ERR_ADMIN_ROLE_REQUIRED = "ERR_ADMIN_ROLE_REQUIRED";
    string public constant ERR_PUBLISHER_ROLE_REQUIRED =
        "ERR_PUBLISHER_ROLE_REQUIRED";

    address private _opAttestationStation;

    function initialize(address opAttestationStation) public initializer {
        AccessControlUpgradeable.__AccessControl_init();

        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(PUBLISHER_ROLE, msg.sender);

        _opAttestationStation = opAttestationStation;
    }

    function grantPublisherRole(address to) external {
        require(hasRole(ADMIN_ROLE, msg.sender), ERR_ADMIN_ROLE_REQUIRED);

        _grantRole(PUBLISHER_ROLE, to);
    }

    function publishGrantedAttestation(
        bytes memory rawKey,
        address to,
        address requestedBy,
        uint256 nonce,
        uint256 daoID,
        uint256 badgeTypeID
    ) external returns (bytes32) {
        require(
            hasRole(PUBLISHER_ROLE, msg.sender),
            ERR_PUBLISHER_ROLE_REQUIRED
        );

        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("type", "grant");
        writer = writer.writeAddressProperty("issued_by", msg.sender); // DAO contract
        writer = writer.writeAddressProperty("requested_by", requestedBy); // operator
        writer = writer.writeUintProperty("nonce", nonce);
        writer = writer.writeUintProperty("dao", daoID);
        writer = writer.writeUintProperty("badge", badgeTypeID);
        writer = writer.writeEndObject();

        bytes32 attestationKey = _createAttestationKey(rawKey);

        IAttester(_opAttestationStation).attest(
            to,
            attestationKey,
            bytes(writer.value)
        );

        return attestationKey;
    }

    struct PublishContributedDTO {
        bytes rawKey;
        address to;
        address verifier;
        string score;
        uint256 nonce;
        uint256 daoID;
        uint256 badgeTypeID;
        uint256 questTypeID;
        uint256 questID;
        uint256 claimID;
    }

    function publishContrbutedAttestation(PublishContributedDTO memory dto)
        external
        returns (bytes32)
    {
        require(
            hasRole(PUBLISHER_ROLE, msg.sender),
            ERR_PUBLISHER_ROLE_REQUIRED
        );

        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("type", "contributed");
        writer = writer.writeAddressProperty("issued_by", msg.sender);
        writer = writer.writeAddressProperty("verified_by", dto.verifier);
        writer = writer.writeStringProperty("score", dto.score);
        writer = writer.writeUintProperty("nonce", dto.nonce);
        writer = writer.writeUintProperty("dao", dto.daoID);
        writer = writer.writeUintProperty("badge", dto.badgeTypeID);
        writer = writer.writeUintProperty("quest_type", dto.questTypeID);
        writer = writer.writeUintProperty("quest", dto.questID);
        writer = writer.writeUintProperty("claim", dto.claimID);
        writer = writer.writeEndObject();

        bytes32 attestationKey = _createAttestationKey(dto.rawKey);

        IAttester(_opAttestationStation).attest(
            dto.to,
            attestationKey,
            bytes(writer.value)
        );

        return attestationKey;
    }

    struct PublishVerifiedDTO {
        bytes rawKey;
        address to;
        address contributor;
        string score;
        uint256 nonce;
        uint256 daoID;
        uint256 badgeTypeID;
        uint256 questTypeID;
        uint256 questID;
        uint256 claimID;
    }

    function publishVerifiedAttestation(PublishVerifiedDTO memory dto)
        external
        returns (bytes32)
    {
        require(
            hasRole(PUBLISHER_ROLE, msg.sender),
            ERR_PUBLISHER_ROLE_REQUIRED
        );

        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("type", "verified");
        writer = writer.writeAddressProperty("issued_by", msg.sender);
        writer = writer.writeAddressProperty("verified_to", dto.contributor);
        writer = writer.writeStringProperty("score", dto.score);
        writer = writer.writeUintProperty("nonce", dto.nonce);
        writer = writer.writeUintProperty("dao", dto.daoID);
        writer = writer.writeUintProperty("badge", dto.badgeTypeID);
        writer = writer.writeUintProperty("quest_type", dto.questTypeID);
        writer = writer.writeUintProperty("quest", dto.questID);
        writer = writer.writeUintProperty("claim", dto.claimID);
        writer = writer.writeEndObject();

        bytes32 attestationKey = _createAttestationKey(dto.rawKey);

        IAttester(_opAttestationStation).attest(
            dto.to,
            attestationKey,
            bytes(writer.value)
        );

        return attestationKey;
    }

    function _writeBadgeObjectToJson(
        JsonWriter.Json memory writer,
        address badgeContract,
        uint256 badgeID,
        string memory badgeName,
        string memory badgeURI
    ) private pure returns (JsonWriter.Json memory) {
        writer = writer.writeStartObject("badge");
        writer = writer.writeAddressProperty("contract", badgeContract);
        writer = writer.writeUintProperty("id", badgeID);
        writer = writer.writeStringProperty("name", badgeName);
        writer = writer.writeStringProperty("uri", badgeURI);
        writer = writer.writeEndObject();

        return writer;
    }

    function _createAttestationKey(bytes memory key)
        private
        pure
        returns (bytes32)
    {
        if (key.length <= 31) {
            return bytes32(key);
        }

        bytes memory hashedKey = abi.encodePacked(keccak256(key));
        bytes31 headKey;

        assembly {
            headKey := mload(add(hashedKey, 31))
        }

        // 31 bytes key + 0xff
        return bytes32(abi.encodePacked(headKey, bytes1(0xff)));
    }
}
