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
			claims {
				claimID
				claimedBlockHash
				claimedBy
				claimedTimestamp
				completedBlock
				completedBlockHash
				createdBlock
				createdBlockHash
				daoID
				createdTransactionHash
				status
				questID
				questTypeID
				updatedBlock
				updatedBlockHash
				updatedBy
				claimedTransactionHash
				completedTimestamp
				completedTransactionHash
				canceledTimestamp
				canceledTransactionHash
			}
		}
		contributorBadge {
			id
		}
		}
		stakes {
			account
			amount
			daoID
		}
		badgeTypes {
			badgeTypeID
			createdBlock
			createdBlockHash
			createdBy
			createdTimestamp
			createdTransactionHash
			daoID
			id
			metadataURI
			name
		}
	}
}
`