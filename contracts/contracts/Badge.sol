// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

// Simple SBT implementation based on ERC1155
contract Badge is AccessControl, ERC1155, ERC1155URIStorage {
    using Counters for Counters.Counter;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string public constant ERR_TRANSFER_NOT_ALLOWED =
        "ERR_TRANSFER_NOT_ALLOWED";
    string public constant ERR_ADMIN_ROLE_REQUIRED = "ERR_ADMIN_ROLE_REQUIRED";
    string public constant ERR_MINTER_ROLE_REQUIRED =
        "ERR_MINTER_ROLE_REQUIRED";

    Counters.Counter private _badgeIDCounter;
    mapping(uint256 => string) _badgeNames;

    event Mint(address issued, address owner, uint256 tokenID, bytes data);

    constructor() ERC1155("") {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function uri(uint256 id)
        public
        view
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        return super.uri(id);
    }

    function name(uint256 id) public view returns (string memory) {
        return _badgeNames[id];
    }

    function totalOfBadgeTypes() public view returns (uint256) {
        return _badgeIDCounter.current();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function grantMinterRole(address to) external {
        require(hasRole(ADMIN_ROLE, msg.sender), ERR_ADMIN_ROLE_REQUIRED);

        _grantRole(MINTER_ROLE, to);
    }

    function createNewBadgeType(string memory name, string memory badgeTypeURI)
        external
        returns (uint256)
    {
        _badgeIDCounter.increment();
        uint256 badgeID = _badgeIDCounter.current();

        _badgeNames[badgeID] = name;
        _setURI(badgeID, badgeTypeURI);

        return badgeID;
    }

    function mintBadge(
        address owner,
        uint256 badgeTypeID,
        bytes memory data
    ) external {
        require(hasRole(MINTER_ROLE, msg.sender), ERR_MINTER_ROLE_REQUIRED);

        _mint(owner, badgeTypeID, 1, data);

        emit Mint(address(msg.sender), owner, badgeTypeID, data);
    }

    function _burn(
        address from,
        uint256 to,
        uint256 amount
    ) internal override {
        revert();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        require(from == address(0x0), ERR_TRANSFER_NOT_ALLOWED);
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
