// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "solidity-json-writer/contracts/JsonWriter.sol";
import "./Badge.sol";

contract PlayDAO is Ownable, Pausable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    using JsonWriter for JsonWriter.Json;

    constructor() {}

    // Types
    struct DAO {
        string name;
        string metadataURI;
        address badgeContract;
        address owner;
        uint256 totalStaked;
        uint256 balance;
    }

    struct BadgeType {
        string name;
        string metadataURI;
    }

    struct QuestType {
        string name;
        string metadataURI;
        // ID of badge to give after quest completion
        uint256 badgeTypeID;
        // IDs of badge which account has to own to start quest
        uint256[] starterDeps;
        // IDs of badge which contributor has to own to claim quest
        uint256[] contributorDeps;
        // IDs of badge which verifier has to own to verify quest
        uint256[] verifierDeps;
    }

    struct Quest {
        uint256 questTypeID;
        string name;
        string metadataURI;
        uint256 limitContributors;
        uint256 numOngoings;
        uint256 numComplted;
        uint256 requiredStake;
    }

    struct Claim {
        address claimer;
        address verifier;
        bool completed;
        bool canceled;
        string proofMetadataURI;
    }

    // Errors
    // Empty Input
    string public constant ERR_EMPTY_DAO_NAME = "ERR_EMPTY_DAO_NAME";
    string public constant ERR_EMPTY_DAO_METADATA_URI =
        "ERR_EMPTY_DAO_METADATA_URI";
    string public constant ERR_EMPTY_DAO_OWNER = "ERR_EMPTY_DAO_OWNER";
    string public constant ERR_EMPTY_BADGE_TYPE_NAME =
        "ERR_EMPTY_BADGE_TYPE_NAME";
    string public constant ERR_EMPTY_BADGE_TYPE_METADATA_URI =
        "ERR_EMPTY_BADGE_TYPE_METADATA_URI";
    string public constant ERR_EMPTY_QUEST_TYPE_NAME =
        "ERR_EMPTY_QUEST_TYPE_NAME";
    string public constant ERR_EMPTY_QUEST_TYPE_METADATA_URI =
        "ERR_EMPTY_QUEST_TYPE_METADATA_URI";
    string public constant ERR_EMPTY_QUEST_NAME = "ERR_EMPTY_QUEST_NAME";
    string public constant ERR_EMPTY_QUEST_METADATA_URI =
        "ERR_EMPTY_QUEST_METADATA_URI";
    string public constant ERR_EMPTY_DAO_BADGE_CONTRACT =
        "ERR_EMPTY_DAO_BADGE_CONTRACT";
    string public constant ERR_ZERO_NUM_CONTRIBUTIONS =
        "ERR_ZERO_NUM_CONTRIBUTIONS";

    // Not Found
    string public constant ERR_DAO_NOT_FOUND = "ERR_DAO_NOT_FOUND";
    string public constant ERR_NOT_DAO_OWNER = "ERR_NOT_DAO_OWNER";
    string public constant ERR_BADGE_TYPE_NOT_FOUND =
        "ERR_BADGE_TYPE_NOT_FOUND";
    string public constant ERR_QUEST_TYPE_NOT_FOUND =
        "ERR_QUEST_TYPE_NOT_FOUND";
    string public constant ERR_QUEST_NOT_FOUND = "ERR_QUEST_NOT_FOUND";
    string public constant ERR_CLAIM_NOT_FOUND = "ERR_CLAIM_NOT_FOUND";

    // Invalid
    string public constant ERR_INSUFFICIENT_STAKE = "ERR_INSUFFICIENT_STAKE";
    string public constant ERR_NO_MORE_CLAIM = "ERR_NO_MORE_CLAIM";
    string public constant ERR_QUEST_CLAIMED_ALREADY =
        "ERR_QUEST_CLAIMED_ALREADY";
    string public constant ERR_START_QUEST_NOT_ALLOWED =
        "ERR_START_QUEST_NOT_ALLOWED";
    string public constant ERR_CLAIM_NOT_ALLOWED = "ERR_CLAIM_NOT_ALLOWED";
    string public constant ERR_VERIFY_CLAIM_NOT_ALLOWED =
        "ERR_VERIFY_CLAIM_NOT_ALLOWED";
    string public constant ERR_CANCEL_CLAIM_NOT_ALLOWED =
        "ERR_CANCEL_CLAIM_NOT_ALLOWED";
    string public constant ERR_SELF_VERIFICATION = "ERR_SELF_VERIFICATION";
    string public constant ERR_WRONG_BADGE_TYPE_ID = "ERR_WRONG_BADGE_TYPE_ID";

    // Events
    event DAOCreated(
        uint256 daoID,
        string name,
        string metadataURI,
        address badgeContract,
        address owner
    );

    event BadgeTypeCreated(
        uint256 indexed daoID,
        uint256 badgeTypeID,
        string name,
        string metadataURI
    );

    event QuestTypeCreated(
        uint256 indexed daoID,
        uint256 questTypeID,
        string name,
        string metadataURI,
        uint256 badgeTypeID,
        uint256[] starterDeps,
        uint256[] contributorDeps,
        uint256[] verifierDeps
    );

    event QuestStarted(
        uint256 indexed daoID,
        uint256 indexed questTypeID,
        uint256 questID,
        string name,
        string metadataURI,
        uint256 numContributions,
        uint256 requiredStake
    );

    event QuestClaimed(
        uint256 indexed daoID,
        uint256 indexed questTypeID,
        uint256 indexed questID,
        uint256 claimID,
        address claimer
    );

    event QuestCanceled(
        uint256 indexed daoID,
        uint256 indexed questID,
        uint256 indexed claimID,
        address operator
    );

    event QuestCompleted(
        uint256 indexed daoID,
        uint256 indexed questID,
        uint256 indexed claimID,
        address verifier,
        string proofMetadataURI
    );

    event Deposited(address indexed account, uint256 amount, uint256 total);

    event Withdrew(address indexed account, uint256 amount, uint256 remaining);

    event WithdrewFromDAO(
        address indexed account,
        uint256 amount,
        uint256 remaining
    );

    // Fields
    Counters.Counter private _countDAO;
    mapping(uint256 => DAO) public _DAOs;

    mapping(uint256 => Counters.Counter) private _countQuestType;
    mapping(uint256 => mapping(uint256 => QuestType)) public _questTypes;

    mapping(uint256 => Counters.Counter) private _countQuest;
    mapping(uint256 => mapping(uint256 => Quest)) public _quests;

    mapping(uint256 => mapping(uint256 => Counters.Counter))
        private _countClaims;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => Claim))) _claims;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) _userToQuestOngoing;

    mapping(uint256 => uint256) _badgeTypeIDToDAO;

    // user's money in contract
    // _deposited: the amount user can withdraw
    // _staked: the amount user locked for quest
    mapping(address => uint256) _deposited;
    mapping(uint256 => mapping(address => uint256)) _staked;

    // Modifiers
    modifier daoExists(uint256 daoID) {
        require(_isNonEmptyString(_DAOs[daoID].name), ERR_DAO_NOT_FOUND);
        _;
    }

    modifier badgeTypeExists(uint256 daoID, uint256 badgeTypeID) {
        require(_badgeTypeExists(daoID, badgeTypeID), ERR_BADGE_TYPE_NOT_FOUND);
        _;
    }

    modifier questTypeExists(uint256 daoID, uint256 questTypeID) {
        require(
            questTypeID <= _countQuestType[daoID].current(),
            ERR_QUEST_TYPE_NOT_FOUND
        );
        _;
    }

    modifier questExists(uint256 daoID, uint256 questID) {
        require(questID <= _countQuest[daoID].current(), ERR_QUEST_NOT_FOUND);
        _;
    }

    modifier claimExists(
        uint256 daoID,
        uint256 questID,
        uint256 claimID
    ) {
        require(
            claimID <= _countClaims[daoID][questID].current(),
            ERR_CLAIM_NOT_FOUND
        );
        _;
    }

    modifier onlyDAOOwner(uint256 daoID, address addr) {
        require(_DAOs[daoID].owner == addr, ERR_NOT_DAO_OWNER);
        _;
    }

    // External functions
    receive() external payable {
        _deposit(msg.sender, msg.value);
    }

    function pause() external onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() external onlyOwner whenPaused {
        _unpause();
    }

    function deposit() external payable whenNotPaused {
        _deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        _withdraw(payable(msg.sender), amount);
    }

    function withdrawFromDAO(uint256 daoID, uint256 amount)
        external
        daoExists(daoID)
        onlyDAOOwner(daoID, msg.sender)
    {
        _withdrawFromDAO(daoID, payable(msg.sender), amount);
    }

    function createDAO(
        string memory name,
        string memory metadataURI,
        address badgeContractAddress,
        address owner
    ) external whenNotPaused {
        _createDAO(name, metadataURI, badgeContractAddress, owner);
    }

    function createBadgeType(
        uint256 daoID,
        string memory name,
        string memory metadataURI
    ) external whenNotPaused daoExists(daoID) onlyDAOOwner(daoID, msg.sender) {
        _createBadgeType(daoID, name, metadataURI);
    }

    function grantBadge(
        uint256 daoID,
        uint256 badgeTypeID,
        address to
    )
        external
        whenNotPaused
        daoExists(daoID)
        onlyDAOOwner(daoID, msg.sender)
        badgeTypeExists(daoID, badgeTypeID)
    {
        _grantBadge(daoID, badgeTypeID, to);
    }

    function createQuestType(
        uint256 daoID,
        string memory name,
        string memory metadataURI,
        uint256 badgeTypeID,
        uint256[] memory starterDeps,
        uint256[] memory contributorDeps,
        uint256[] memory verifierDeps
    ) external whenNotPaused daoExists(daoID) onlyDAOOwner(daoID, msg.sender) {
        _createQuestType(
            daoID,
            name,
            metadataURI,
            badgeTypeID,
            starterDeps,
            contributorDeps,
            verifierDeps
        );
    }

    function startQuest(
        uint256 daoID,
        uint256 questTypeID,
        string memory name,
        string memory metadataURI,
        uint256 numContributions,
        uint256 requiredStake
    )
        external
        whenNotPaused
        daoExists(daoID)
        questTypeExists(daoID, questTypeID)
    {
        _startQuest(
            daoID,
            questTypeID,
            name,
            metadataURI,
            numContributions,
            requiredStake
        );
    }

    function claimQuest(uint256 daoID, uint256 questID)
        external
        payable
        whenNotPaused
        daoExists(daoID)
        questExists(daoID, questID)
    {
        _claimQuest(daoID, questID, msg.sender, msg.value);
    }

    function cancelClaim(
        uint256 daoID,
        uint256 questID,
        uint256 claimID
    )
        external
        whenNotPaused
        daoExists(daoID)
        questExists(daoID, questID)
        claimExists(daoID, questID, claimID)
    {
        _cancelClaim(daoID, questID, claimID);
    }

    function completeQuest(
        uint256 daoID,
        uint256 questID,
        uint256 claimID,
        string memory proofMetadataURI
    )
        external
        whenNotPaused
        daoExists(daoID)
        questExists(daoID, questID)
        claimExists(daoID, questID, claimID)
    {
        _completeQuest(daoID, questID, claimID, proofMetadataURI, msg.sender);
    }

    // Public functions
    // Public view functions

    function totalDAOs() public view returns (uint256) {
        return _countDAO.current();
    }

    function totalQuestTypes(uint256 daoID) public view returns (uint256) {
        return _countQuestType[daoID].current();
    }

    function totalQuests(uint256 daoID) public view returns (uint256) {
        return _countQuest[daoID].current();
    }

    function totalClaims(uint256 daoID, uint256 questID)
        public
        view
        returns (uint256)
    {
        return _countClaims[daoID][questID].current();
    }

    function totalStaked(uint256 daoID) public view returns (uint256) {
        return _DAOs[daoID].totalStaked;
    }

    function balanceOf(uint256 daoID) public view returns (uint256) {
        return _DAOs[daoID].balance;
    }

    function depositedOf(address account) public view returns (uint256) {
        return _deposited[account];
    }

    // Public pure functions

    // Internal functions

    // Private functions
    function _deposit(address account, uint256 amount) private {
        _deposited[account] = _deposited[account].add(amount);

        emit Deposited(account, amount, _deposited[account]);
    }

    function _withdraw(address payable account, uint256 amount) private {
        _deposited[account] = _deposited[account].sub(amount);

        account.transfer(amount);

        emit Withdrew(account, amount, _deposited[account]);
    }

    function _withdrawFromDAO(
        uint256 daoID,
        address payable to,
        uint256 amount
    ) private {
        _DAOs[daoID].balance = _DAOs[daoID].balance.sub(amount);

        to.transfer(amount);

        emit WithdrewFromDAO(to, amount, _DAOs[daoID].balance);
    }

    function _createDAO(
        string memory name,
        string memory metadataURI,
        address badgeContractAddress,
        address daoOwner
    ) private {
        require(_isNonEmptyString(name), ERR_EMPTY_DAO_NAME);
        require(_isNonEmptyString(metadataURI), ERR_EMPTY_DAO_METADATA_URI);
        require(
            badgeContractAddress != address(0x0),
            ERR_EMPTY_DAO_BADGE_CONTRACT
        );
        require(daoOwner != address(0x0), ERR_EMPTY_DAO_OWNER);

        _countDAO.increment();
        uint256 daoID = _countDAO.current();

        _DAOs[daoID] = DAO({
            name: name,
            metadataURI: metadataURI,
            badgeContract: badgeContractAddress,
            owner: daoOwner,
            totalStaked: 0,
            balance: 0
        });

        emit DAOCreated(
            daoID,
            name,
            metadataURI,
            badgeContractAddress,
            daoOwner
        );
    }

    function _createBadgeType(
        uint256 daoID,
        string memory name,
        string memory metadataURI
    ) private {
        require(_isNonEmptyString(name), ERR_EMPTY_BADGE_TYPE_NAME);
        require(
            _isNonEmptyString(metadataURI),
            ERR_EMPTY_BADGE_TYPE_METADATA_URI
        );

        uint256 badgeTypeID = Badge(_DAOs[daoID].badgeContract)
            .createNewBadgeType(name, metadataURI);

        _badgeTypeIDToDAO[badgeTypeID] = daoID;

        emit BadgeTypeCreated(daoID, badgeTypeID, name, metadataURI);
    }

    function _grantBadge(
        uint256 daoID,
        uint256 badgeTypeID,
        address to
    ) private {
        require(
            _badgeTypeIDToDAO[badgeTypeID] == daoID,
            ERR_WRONG_BADGE_TYPE_ID
        );

        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("Type", "Grant");
        writer = writer.writeAddressProperty("Issued", address(this));
        writer = writer.writeUintProperty("DAO", daoID);
        writer = writer.writeAddressProperty("Requested", msg.sender);
        writer = writer.writeEndObject();

        Badge(_DAOs[daoID].badgeContract).mintBadge(
            to,
            badgeTypeID,
            bytes(writer.value)
        );
    }

    function _createQuestType(
        uint256 daoID,
        string memory name,
        string memory metadataURI,
        uint256 badgeTypeID,
        uint256[] memory starterDeps,
        uint256[] memory contributorDeps,
        uint256[] memory verifierDeps
    ) private {
        require(_isNonEmptyString(name), ERR_EMPTY_QUEST_TYPE_NAME);
        require(
            _isNonEmptyString(metadataURI),
            ERR_EMPTY_QUEST_TYPE_METADATA_URI
        );

        // make sure badge types exist
        require(_badgeTypeExists(daoID, badgeTypeID), ERR_BADGE_TYPE_NOT_FOUND);
        require(
            _verifyBadgeTypesExist(daoID, starterDeps),
            ERR_BADGE_TYPE_NOT_FOUND
        );
        require(
            _verifyBadgeTypesExist(daoID, contributorDeps),
            ERR_BADGE_TYPE_NOT_FOUND
        );
        require(
            _verifyBadgeTypesExist(daoID, verifierDeps),
            ERR_BADGE_TYPE_NOT_FOUND
        );

        _countQuestType[daoID].increment();
        uint256 questTypeID = _countQuestType[daoID].current();

        _questTypes[daoID][questTypeID] = QuestType({
            name: name,
            metadataURI: metadataURI,
            badgeTypeID: badgeTypeID,
            starterDeps: starterDeps,
            contributorDeps: contributorDeps,
            verifierDeps: verifierDeps
        });

        emit QuestTypeCreated(
            daoID,
            questTypeID,
            name,
            metadataURI,
            badgeTypeID,
            starterDeps,
            contributorDeps,
            verifierDeps
        );
    }

    function _startQuest(
        uint256 daoID,
        uint256 questTypeID,
        string memory name,
        string memory metadataURI,
        uint256 numContributions,
        uint256 requiredStake
    ) private {
        require(_isNonEmptyString(name), ERR_EMPTY_QUEST_TYPE_NAME);
        require(_isNonEmptyString(metadataURI), ERR_EMPTY_QUEST_METADATA_URI);
        require(numContributions > 0, ERR_ZERO_NUM_CONTRIBUTIONS);
        require(
            _verifyBadgeTypeOwned(
                daoID,
                _questTypes[daoID][questTypeID].starterDeps,
                msg.sender
            ),
            ERR_START_QUEST_NOT_ALLOWED
        );

        _countQuest[daoID].increment();
        uint256 questID = _countQuest[daoID].current();

        _quests[daoID][questID] = Quest({
            questTypeID: questTypeID,
            name: name,
            metadataURI: metadataURI,
            limitContributors: numContributions,
            numOngoings: 0,
            numComplted: 0,
            requiredStake: requiredStake
        });

        emit QuestStarted(
            daoID,
            questTypeID,
            questID,
            name,
            metadataURI,
            numContributions,
            requiredStake
        );
    }

    function _claimQuest(
        uint256 daoID,
        uint256 questID,
        address claimer,
        uint256 newStake
    ) private {
        Quest storage quest = _quests[daoID][questID];

        require(
            _verifyBadgeTypeOwned(
                daoID,
                _questTypes[daoID][quest.questTypeID].contributorDeps,
                claimer
            ),
            ERR_CLAIM_NOT_ALLOWED
        );

        require(
            !_userToQuestOngoing[daoID][questID][claimer],
            ERR_QUEST_CLAIMED_ALREADY
        );

        // make sure user can claim a quest
        require(
            quest.numOngoings + quest.numComplted < quest.limitContributors,
            ERR_NO_MORE_CLAIM
        );

        // deposit first if user pays
        if (newStake > 0) {
            _deposit(claimer, newStake);
        }

        // check user can lock required amount
        require(
            _deposited[claimer] >= quest.requiredStake,
            ERR_INSUFFICIENT_STAKE
        );

        _stake(daoID, claimer, quest.requiredStake);

        // increment ongoing count
        quest.numOngoings++;
        _userToQuestOngoing[daoID][questID][claimer] = true;

        _countClaims[daoID][questID].increment();
        uint256 claimID = _countClaims[daoID][questID].current();

        _claims[daoID][questID][claimID] = Claim({
            claimer: claimer,
            verifier: address(0x0),
            completed: false,
            canceled: false,
            proofMetadataURI: ""
        });

        emit QuestClaimed(daoID, quest.questTypeID, questID, claimID, claimer);
    }

    function _cancelClaim(
        uint256 daoID,
        uint256 questID,
        uint256 claimID
    ) private {
        Claim storage claim = _claims[daoID][questID][claimID];

        require(
            // claimer or verifier
            msg.sender == claim.claimer ||
                _verifyBadgeTypeOwned(
                    daoID,
                    _questTypes[daoID][_quests[daoID][questID].questTypeID]
                        .verifierDeps,
                    msg.sender
                ),
            ERR_CANCEL_CLAIM_NOT_ALLOWED
        );

        _claims[daoID][questID][claimID].canceled = true;

        _slash(daoID, claim.claimer, _quests[daoID][questID].requiredStake);

        emit QuestCanceled(daoID, questID, claimID, msg.sender);
    }

    function _completeQuest(
        uint256 daoID,
        uint256 questID,
        uint256 claimID,
        string memory proofMetadataURI,
        address verifier
    ) private {
        Quest storage quest = _quests[daoID][questID];
        Claim storage claim = _claims[daoID][questID][claimID];

        require(claim.claimer != verifier, ERR_SELF_VERIFICATION);

        require(
            _verifyBadgeTypeOwned(
                daoID,
                _questTypes[daoID][quest.questTypeID].verifierDeps,
                verifier
            ),
            ERR_VERIFY_CLAIM_NOT_ALLOWED
        );

        uint256 badgeTypeID = _questTypes[daoID][quest.questTypeID].badgeTypeID;

        _unstake(daoID, claim.claimer, quest.requiredStake);

        quest.numComplted++;
        quest.numOngoings--;

        JsonWriter.Json memory writer1;
        writer1 = writer1.writeStartObject();
        writer1 = writer1.writeStringProperty("Type", "Contributed");
        writer1 = writer1.writeAddressProperty("Issued", address(this));
        writer1 = writer1.writeUintProperty("DAO", daoID);
        writer1 = writer1.writeAddressProperty("Verified", verifier);
        writer1 = writer1.writeEndObject();

        Badge(_DAOs[daoID].badgeContract).mintBadge(
            claim.claimer,
            badgeTypeID,
            bytes(writer1.value)
        );

        JsonWriter.Json memory writer2;
        writer2 = writer2.writeStartObject();
        writer2 = writer2.writeStringProperty("Type", "Verified");
        writer2 = writer2.writeAddressProperty("Issued", address(this));
        writer2 = writer2.writeUintProperty("DAO", daoID);
        writer2 = writer2.writeAddressProperty("Target", claim.claimer);
        writer2 = writer2.writeEndObject();

        Badge(_DAOs[daoID].badgeContract).mintBadge(
            verifier,
            badgeTypeID,
            bytes(writer2.value)
        );

        emit QuestCompleted(
            daoID,
            questID,
            claimID,
            verifier,
            proofMetadataURI
        );
    }

    function _stake(
        uint256 daoID,
        address account,
        uint256 amount
    ) private {
        // move asset from depositted to staked
        _deposited[account] = _deposited[account].sub(amount);
        _staked[daoID][account] = _staked[daoID][account].add(amount);

        // update DAO's total stake
        _DAOs[daoID].totalStaked = _DAOs[daoID].totalStaked.add(amount);
    }

    function _unstake(
        uint256 daoID,
        address account,
        uint256 amount
    ) private {
        // move asset from staked to depositted
        _staked[daoID][account] = _staked[daoID][account].sub(amount);
        _deposited[account] = _deposited[account].add(amount);

        // update DAO's total stake
        _DAOs[daoID].totalStaked = _DAOs[daoID].totalStaked.sub(amount);
    }

    function _slash(
        uint256 daoID,
        address account,
        uint256 amount
    ) private {
        // reduce user's stake
        _staked[daoID][account] = _staked[daoID][account].sub(amount);

        // update DAO's total stake
        _DAOs[daoID].totalStaked = _DAOs[daoID].totalStaked.sub(amount);
        _DAOs[daoID].balance = _DAOs[daoID].balance.add(amount);
    }

    // Helper functions
    function _isNonEmptyString(string memory str) internal pure returns (bool) {
        return bytes(str).length > 0;
    }

    function _verifyBadgeTypesExist(
        uint256 daoID,
        uint256[] memory badgeTypeIDs
    ) private returns (bool) {
        uint256 upperBound = Badge(_DAOs[daoID].badgeContract)
            .totalOfBadgeTypes();

        for (uint256 i = 0; i < badgeTypeIDs.length; i++) {
            if (badgeTypeIDs[i] > upperBound) {
                return false;
            }
        }

        return true;
    }

    function _verifyBadgeTypeOwned(
        uint256 daoID,
        uint256[] memory badgeTypeIDs,
        address acc
    ) private returns (bool) {
        Badge badge = Badge(_DAOs[daoID].badgeContract);

        for (uint256 i = 0; i < badgeTypeIDs.length; i++) {
            if (badge.balanceOf(acc, badgeTypeIDs[0]) == 0) {
                return false;
            }
        }

        return true;
    }

    function _badgeTypeExists(uint256 daoID, uint256 badgeTypeID)
        private
        returns (bool)
    {
        return
            badgeTypeID <=
            Badge(_DAOs[daoID].badgeContract).totalOfBadgeTypes();
    }
}
