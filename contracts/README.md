# Sample Hardhat Project

## How to deploy

## Contract interface

```sol
interface IPlayDAO {
    // normal transfer, deposit user's asset to contract
    receive() external payable;

    // pause, all transaction operation
    function pause() external;

    // unpause
    function unpause() external;

    // deposit user's asset to stake later
    function deposit() external;

    // withdraw user's deposit which is not locked by quest
    function withdraw(uint256 amount)

    // withdraw user's slashed amount by DAO admin
    function withdrawFromDAO(uint256 daoID, uint256 amount);

    // create a new DAO
    function createDAO(
        // DAO name
        string memory name,

        // URI of metadata describing about DAO
        string memory metadataURI,

        // Badge Contract Address
        address badgeContractAddress,

        // DAO Owner Address
        address owner
    ) external;

    // create a new badge type in DAO
    function createBadgeType(
        // Existing DAO ID
        uint256 daoID,

        // Badge Type Name
        string memory name,

        // URI of metadata describing about BadgeType
        string memory metadataURI
    ) external;

    // create a new quest type in DAO
    function createQuestType(
        // Existing DAO ID
        uint256 daoID,

        // Quest Type Name
        string memory name,

        // URI of metadata describing about QuestType
        string memory metadataURI,

        // ID of Badge to be granted after quest completion
        uint256 badgeTypeID,

        // IDs of the Badges an account who starts quest has to own
        // (Badge type must be defined before)
        uint256[] memory starterDeps,

        // IDs of the Badges an account who claims quest has to own
        // (Badge type must be defined before)
        uint256[] memory contributorDeps,

        // IDs of the Badges an account who verify claims has to own
         // (Badge type must be defined before)
        uint256[] memory verifierDeps
    )

    // start a new quest based on QuestType
    // account has to own specific badges defined in quest type (Ref: starterDeps)
    function startQuest(
        // Existing DAO ID
        uint256 daoID,

        // Existing Quest Type ID
        uint256 questTypeID,

        // How many times the quest can be claimed or completed
        // Will reject a new claim if (num of ongoing claims + num of completions) exceeds this value
        uint256 numContributions,

        // How much does user need to stake in order to claim this quest
        uint256 requiredStake
    )

    // claim a quest
    // account has to own specific badges defined in quest type (Ref: contributorDeps)
    // and the account has to have staked required amount
    // user can transfer in this transaction, in this case user can claim a quest
    // only if (staked amount an account has staked before + sent amount) equals to/greater than required stake
    function claimQuest(
        uint256 daoID,
        uint256 questID,
    );

    // cancel a claim by claim owner or verifier
    // verifier has to own specific badges defined in QuestType (Ref: verifierDeps)
    function cancelClaim(
        // existing DAO ID
        uint256 daoID,

        // existing quest ID
        uint256 questID,

        // existing claim ID
        uint256 claimID
    )

    // complete a claim by verifier
    // verifier has to own specific badges defined in QuestType (Ref: verifierDeps)
    function completeQuest(
        // existing DAO ID
        uint256 daoID,

        // existing Quest ID
        uint256 questID,

        // existing Claim ID
        uint256 claimID,

        // URI of metadata indicating about proof of completion
        string memory proofContentURI
    );
}
```
