// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Simple SBT implementation inheriting ERC721
// Implements ERC-721 and ERC5114
contract Badge is AccessControl, ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string public constant ERR_TRANSFER_NOT_ALLOWED =
        "ERR_TRANSFER_NOT_ALLOWED";
    string public constant ERR_ADMIN_ROLE_REQUIRED = "ERR_ADMIN_ROLE_REQUIRED";
    string public constant ERR_MINTER_ROLE_REQUIRED =
        "ERR_MINTER_ROLE_REQUIRED";

    enum ActionType {
        Contributed,
        Verified,
        Grant
    }

    struct Badge {
        address issued;
        ActionType actionType;
        uint256 badgeTypeID;
        uint256 daoID;
        address owner;
        string proofURI;
    }

    mapping(uint256 => Badge) _badges;

    event Mint(
        address issued,
        address owner,
        uint256 tokenID,
        string proofURI,
        uint256 daoID,
        uint256 badgeTypeID,
        ActionType actionType
    );

    constructor(string memory name, string memory symbol)
        public
        ERC721(name, symbol)
    {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function grantMinterRole(address to) external {
        require(hasRole(ADMIN_ROLE, msg.sender), ERR_ADMIN_ROLE_REQUIRED);

        _grantRole(MINTER_ROLE, to);
    }

    function mintBadge(
        address owner,
        uint256 tokenID,
        string memory proofURI,
        uint256 daoID,
        uint256 badgeTypeID,
        ActionType actionType
    ) external {
        require(hasRole(MINTER_ROLE, msg.sender), ERR_MINTER_ROLE_REQUIRED);

        _mint(owner, tokenID);
        _setTokenURI(tokenID, proofURI);
        _badges[tokenID] = Badge({
            issued: msg.sender,
            actionType: actionType,
            badgeTypeID: badgeTypeID,
            daoID: daoID,
            owner: owner,
            proofURI: proofURI
        });

        emit Mint(
            address(msg.sender),
            owner,
            tokenID,
            proofURI,
            daoID,
            badgeTypeID,
            actionType
        );
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        revert();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 startIndex,
        uint256 batchSize
    ) internal override {
        require(from == address(0x0), ERR_TRANSFER_NOT_ALLOWED);
        super._beforeTokenTransfer(from, to, startIndex, batchSize);
    }
}
