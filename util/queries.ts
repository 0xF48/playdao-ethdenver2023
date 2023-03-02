import { gql } from "@apollo/client";


export const QUERY_DAO = gql`
query dao($id: String!){
	dao(id: $id){
	id
    badgeContract
    balance
    createdBlock
    createdBlockHash
    createdBy
    createdTimestamp
    createdTransactionHash
    daoID
    metadataURI
    totalStaked
    name
    questTypes {
      contributorBadgeTypeID
      createdBlock
      createdBlockHash
      createdBy
      createdTimestamp
      createdTransactionHash
      daoID
      metadataURI
      name
      id
      questTypeID
	  contributorDeps {
        id
      }
      starterDeps {
        badgeType {
          badgeTypeID
        }
      }
      verifierDeps {
        badgeType {
          badgeTypeID
        }
      }
      verifierBadgeTypeID
      contributorBadge {
        id
        createdBlockHash
        createdBy
        createdTimestamp
        createdTransactionHash
        metadataURI
        name
        createdBlock
        badgeTypeID
      }
      quests {
        createdBlock
        createdBlockHash
        createdBy
        createdTimestamp
        createdTransactionHash
        limitContributions
        metadataURI
        name
        numCanceled
        numCompleted
        numOnGoings
        questID
        questTypeID
        requiredStake
        daoID
        id
		
        claims {
          claimID
          claimedBlock
          claimedBlockHash
          claimedBy
          claimedTimestamp
          claimedTransactionHash
          completedBlock
          createdBlock
          createdBlockHash
          createdBy
          createdTimestamp
          daoID
          createdTransactionHash
          id
          proofMetadataURI
          questID
          status
          questTypeID
          verifiedBy
          canceledBy
          canceledTimestamp
          canceledTransactionHash
        }
      }
    }
    badgeTypes {
      createdBlockHash
      createdBy
      createdTimestamp
      createdTransactionHash
      daoID
      id
      metadataURI
      name
      createdBlock
      badgeTypeID
    }
    stakes {
      account
      amount
      daoID
    }
	}
}
`