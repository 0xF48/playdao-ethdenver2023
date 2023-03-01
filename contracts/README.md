## Playdao Contract

### Interface

```solidity
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

    // grant a new badge to specific address
    // (especially for assigning role)
    function grantBadge(
        // DAO ID
        uint256 daoID,

        // Badge Type ID
        uint256 badgeTypeID,

        // Give to
        address to,

        // MetadataURI
        string memory metadataURI
    )

    // create a new quest type in DAO
    function createQuestType(
        // Existing DAO ID
        uint256 daoID,

        // Quest Type Name
        string memory name,

        // URI of metadata describing about QuestType
        string memory metadataURI,

        // ID of badge to be given to contributor after quest completion
        uint256 contributorBadgeTypeID,

        // ID of badge to be given to verifier after quest completion
        uint256 verifierBadgeTypeID;

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

        // quest name
        string name,

        // URI of metadata describing about Quest
        string contentURI,

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

## ID

DAO ID: Unique in DAOs of a contract
Badge Type ID: Unique in Badge Types in a contract
Quest Type ID: Unique in Quest Types of a DAO of a contract (DAO ID > Quest Type ID)
Quest ID: Unique in Quests of Quest Types of DAO (DAO ID > Quest Type ID > Quest ID)
Claim ID: Unique in Claims of Quest of DAO (DAO ID > Quests > Claim ID)

## PlayDAO Graph Query Example

query example

```gql
{
  daos {
    id
    daoID
    name
    metadataURI
    badgeContract
    totalStaked
    balance
    
    badgeTypes {
      id
      daoID
      badgeTypeID
      name
      metadataURI
    }
    
    questTypes {
      id
      daoID
      questTypeID
      name
      metadataURI
      contributorBadgeTypeID
      verifierBadgeTypeID
      
      contributorBadge {
        id
        name
        metadataURI
      }
      
      verifierBadge {
        id
        name
        metadataURI
      }
      
      starterDeps {
        id
        badgeType {
          id
          name
          metadataURI
        }
      }
      
      contributorDeps {
        id
        badgeType {
          id
          name
          metadataURI
        }
      }
      
    quests {
      id
      daoID
      questTypeID
      questID
      name
      metadataURI
      limitContributions
      numOnGoings
      numCompleted
      numCanceled
      requiredStake
      
      claims {
        id
        daoID
        questTypeID
        questID
        claimID
        status
        
        claimedBy
        claimedBlock
        
        verifiedBy
        completedBlock
      }
    }
    }
  }
  
  userStakes {
    daoID
    account
    amount
  }
  
  userDeposits {
    id
    account
    amount
  }
}
```

result example

```json

```

## Deployment

### Mumbai (Deployed 1 Mar 9:00)

Badge: 0x841b7A8ED11564E94815E069bA64084bF798C06b
PlayDAO: 0xD8A2E11a8C3776f1F74Ea898f54bA86Af25c1864

Graph: https://api.thegraph.com/subgraphs/name/kourin1996/playdao_mumbai

## Note

GRAPH_ALLOW_NON_DETERMINISTIC_FULLTEXT_SEARCH=true