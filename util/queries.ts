import { gql } from "@apollo/client";


export const QUERY_QUEST = gql`
  query quest($id: String!){
    quest(id: $id) {
      questType {
        questTypeID
        metadataURI
      }
      daoID
      metadataURI
      limitContributions
      claims {
        id
        questID
        questTypeID
        score
        status
        claimID
        claimedBy
        proofMetadataURI
        claimedBlock
        claimedBlockHash
      }
      questTypeID
      requiredStake
    }
  }
`

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
		badgeType {
			badgeTypeID
        }
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
        badgeTypeID
        createdBy
        createdTimestamp
        createdTransactionHash
        metadataURI
        name
      }
      quests {
        createdBy
        createdTimestamp
        limitContributions
        metadataURI
        name
        numCanceled
        numCompleted
        numOnGoings
        questID
        requiredStake
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