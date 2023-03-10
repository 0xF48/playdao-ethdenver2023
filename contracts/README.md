# PlayDAO Contracts

PlayDAO is a contract enabling user to create a new DAO and micro tasks called `Quest`. Badges are granted to contributor and verifier once an account complete a quest.

## How to deploy

You can deploy contracts with several ways

## How to upload file to FileStorage contract?

1. Deploy a new file storage contract

```bash
$ npx ethfs-uploader --create --privateKey <PRIVATE_KEY> --chainId <CHAIN_ID> --RPC <RPC_URL>

# contract address appears
```

2. Convert a file to new file with unique name

```bash
$ npx hardhat convert_file --path <FILE>

# filename appears
```

3. Upload a file to FileStorage contract

```bash
$ npx ethfs-uploader <FILE> <CONTRACT_ADDRESS> --privateKey <PRIVATE_KEY> --RPC <RPC_URL>
```

### 1. Hardhat script

```bash
$ npm i
$ npx hardhat run scripts/deploy.ts --network <NETWORK>
```

### 2. Truffle Dashboard (Require Hardhat in browser)

```bash
$ npx truffle dashboard

# In Other terminal
$ npm i
$ npx hardhat run scripts/deploy.ts --network truffle_dashboard
```

### 3. ChugSplash

```bash
$ npm i
$ npx hardhat chugsplash-deploy --config-path chugsplash/playdao.ts
```

## Contract

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
        address to
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
        uint256 verifierBadgeTypeID,

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
        string memory proofMetadataURI,

        // Arbitrary text for short score
        string memory score
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

  badgeIssueHistories {
    id
    account
    daoID
    type
    requested
    questID
    claimID
    attestationKey
    attestationCreator
  }
}
```

result example

```json
{
  "data": {
    "daos": [
      {
        "id": "0x1",
        "daoID": "1",
        "name": "Test DAO1",
        "metadataURI": "ipfs:DAO1",
        "badgeContract": "0xf7f39710da63fefc0d496038ceeeecaf5e3e4f1d",
        "totalStaked": "0",
        "balance": "0",
        "badgeTypes": [
          {
            "id": "0x1_0x1",
            "daoID": "1",
            "badgeTypeID": "1",
            "name": "BadgeType1",
            "metadataURI": "ipfs:BadgeType1"
          }
        ],
        "questTypes": [
          {
            "id": "0x1_0x1",
            "daoID": "1",
            "questTypeID": "1",
            "name": "QuestType1",
            "metadataURI": "ipfs:QuestType1",
            "contributorBadgeTypeID": "1",
            "verifierBadgeTypeID": "1",
            "contributorBadge": {
              "id": "0x1_0x1",
              "name": "BadgeType1",
              "metadataURI": "ipfs:BadgeType1"
            },
            "verifierBadge": {
              "id": "0x1_0x1",
              "name": "BadgeType1",
              "metadataURI": "ipfs:BadgeType1"
            },
            "starterDeps": [],
            "contributorDeps": [],
            "quests": [
              {
                "id": "0x1_0x1_0x1",
                "daoID": "1",
                "questTypeID": "1",
                "questID": "1",
                "name": "Quest1",
                "metadataURI": "ipfs:Quest1",
                "limitContributions": "1",
                "numOnGoings": "0",
                "numCompleted": "0",
                "numCanceled": "0",
                "requiredStake": "0",
                "claims": [
                  {
                    "id": "0x1_0x1_0x1",
                    "daoID": "1",
                    "questTypeID": "1",
                    "questID": "1",
                    "claimID": "1",
                    "status": "completed",
                    "claimedBy": "0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f",
                    "claimedBlock": "6188617",
                    "verifiedBy": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
                    "completedBlock": "6188620"
                  }
                ]
              }
            ]
          },
          {
            "id": "0x1_0x2",
            "daoID": "1",
            "questTypeID": "2",
            "name": "QuestType2",
            "metadataURI": "ipfs:QuestType2",
            "contributorBadgeTypeID": "1",
            "verifierBadgeTypeID": "1",
            "contributorBadge": {
              "id": "0x1_0x1",
              "name": "BadgeType1",
              "metadataURI": "ipfs:BadgeType1"
            },
            "verifierBadge": {
              "id": "0x1_0x1",
              "name": "BadgeType1",
              "metadataURI": "ipfs:BadgeType1"
            },
            "starterDeps": [
              {
                "id": "0x1_0x2_0x1",
                "badgeType": {
                  "id": "0x1_0x1",
                  "name": "BadgeType1",
                  "metadataURI": "ipfs:BadgeType1"
                }
              }
            ],
            "contributorDeps": [
              {
                "id": "0x1_0x2_0x1",
                "badgeType": {
                  "id": "0x1_0x1",
                  "name": "BadgeType1",
                  "metadataURI": "ipfs:BadgeType1"
                }
              }
            ],
            "quests": [
              {
                "id": "0x1_0x2_0x2",
                "daoID": "1",
                "questTypeID": "2",
                "questID": "2",
                "name": "Quest2",
                "metadataURI": "ipfs:Quest2",
                "limitContributions": "1",
                "numOnGoings": "0",
                "numCompleted": "0",
                "numCanceled": "0",
                "requiredStake": "1",
                "claims": [
                  {
                    "id": "0x1_0x2_0x1",
                    "daoID": "1",
                    "questTypeID": "2",
                    "questID": "2",
                    "claimID": "1",
                    "status": "completed",
                    "claimedBy": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
                    "claimedBlock": "6188629",
                    "verifiedBy": "0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f",
                    "completedBlock": "6188631"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "userStakes": [
      {
        "daoID": "1",
        "account": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
        "amount": "0"
      }
    ],
    "userDeposits": [
      {
        "id": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
        "account": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
        "amount": "1"
      }
    ],
    "badgeIssueHistories": [
      {
        "id": "0x1_0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7_contributed_0x023374f247721f45b2e87d716f0bb4b81b1666306616fd59fce3926a23b9eb7d",
        "account": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
        "daoID": "1",
        "type": "contributed",
        "requested": "0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f",
        "questID": "2",
        "claimID": "1",
        "attestationKey": "0x20058adf598beb7f40a34290eb5a0e8bc8ac649e43802e05d3a684bd560ba5ff",
        "attestationCreator": "0x9a061a52b92cab2da7313fb03dc7e1ce7320cf40"
      },
      {
        "id": "0x1_0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7_verified_0x896875d2dd64bd04365e89c76b3583c8363763b672e57d8f34afc830081f455b",
        "account": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
        "daoID": "1",
        "type": "verified",
        "requested": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
        "questID": "1",
        "claimID": "1",
        "attestationKey": "0x20f326294ba18feec77c022ac91c140cc1329aa1c48553674df009d4bc6748ff",
        "attestationCreator": "0x9a061a52b92cab2da7313fb03dc7e1ce7320cf40"
      },
      {
        "id": "0x1_0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f_contributed_0x896875d2dd64bd04365e89c76b3583c8363763b672e57d8f34afc830081f455b",
        "account": "0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f",
        "daoID": "1",
        "type": "contributed",
        "requested": "0x65d4ec89ce26763b4bea27692e5981d8cd3a58c7",
        "questID": "1",
        "claimID": "1",
        "attestationKey": "0x205bbbd89351c71060a4dc84397e3ec27a532ff9e36171aa191f7a7ad005deff",
        "attestationCreator": "0x9a061a52b92cab2da7313fb03dc7e1ce7320cf40"
      },
      {
        "id": "0x1_0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f_verified_0x023374f247721f45b2e87d716f0bb4b81b1666306616fd59fce3926a23b9eb7d",
        "account": "0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f",
        "daoID": "1",
        "type": "verified",
        "requested": "0x68e7bd8736ded1df80cbe5fd74a50e904f6c6f3f",
        "questID": "2",
        "claimID": "1",
        "attestationKey": "0x203bc6420ef9353f449287467ee629ec4ab1b7286fabe829195505034e5138ff",
        "attestationCreator": "0x9a061a52b92cab2da7313fb03dc7e1ce7320cf40"
      }
    ]
  }
}
```

## Deployment

### Mumbai

Badge: 0xd30aBe5BE2f094d9Fd7846Be7BBba7A2613d2593
PlayDAO: 0x3D295FE2750d98fFE3016cfa4BA35188DB3B65B3

Explorer: https://mumbai.polygonscan.com/
Graph: https://api.thegraph.com/subgraphs/name/kourin1996/playdao_mumbai_2
JSON-RPC: https://rpc-mumbai.maticvigil.com/

### Base Testnet

Badge: 0x3Ad465f8D9B350fb5eA1f5C56dAA19B40613d1D4
PlayDAO: 0x74C708AAB2b1761795fe75535EeF79Adf9b8d1cF

Explorer: https://goerli.basescan.org/
Graph: https://api.studio.thegraph.com/query/37331/playdao_base_testnet/v0.1.0
JSON-RPC: https://goerli.base.org

### Optimism Goerli

Badge: 0x20c72945dBf631A04DC3F5548C18158B0A5Ed4D1
PlayDAO: 0xb56D50cb2a98DBaeA5e055bC09bEc9E31bAE6C9a
AttestationPublisher: 0x08131e8FffD67960D18Ddb31AACC308674F0Ca81

Explorer: https://goerli-optimism.etherscan.io/
Graph: https://api.studio.thegraph.com/query/37331/playdao_optimism_testnet/v0.1.7
JSON-RPC: https://goerli.optimism.io

### Scroll Testnet

Badge: 0x3F9A49825A0b2E836C071eb72375748aDe309f15
PlayDAO: 0x10FFB3efA577e5CFB83FA11592984919106CC770

## Note

GRAPH_ALLOW_NON_DETERMINISTIC_FULLTEXT_SEARCH=true
