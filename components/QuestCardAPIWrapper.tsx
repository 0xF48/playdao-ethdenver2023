import QuestCard from "./QuestCard"
import { useQuest, useOrganization, extractQuestAndQuestType } from "../util/hooks"
import _ from 'lodash'
import Link from "next/link"

export default function QuestCardAPIWrapper({ questId }: any) {

	let { loading: dao_loading, data: dao_data, error: query_error } = useOrganization()

	var quest: any;
	var quest_type: any;

	if (dao_data) {
		var dao = dao_data.dao
		var [quest, quest_type]: any = extractQuestAndQuestType(questId, dao)
	}


	if (dao_loading || !dao) {
		return <div>loading...</div>
	}
	if (quest == null || quest_type == null) {
		return <div>quest not found</div>
	}
	if (query_error) {
		return <div>{query_error.message}</div>
	}


	let claims_left = Number(quest.limitContributions) - quest.claims.length

	let is_locked = false
	let is_claimed = true


	let claimant_deps: any = quest_type.contributorDeps.map((dep: any) => {
		let dep_badge_id = dep.badgeType.badgeTypeID
		let badge_type_data = _.find(dao.badgeTypes, { badgeTypeID: dep_badge_id })
		return {
			badge_name: badge_type_data.name,
			badge_url: badge_type_data.metadataURI
		}
	})

	let validator_deps: any = quest_type.verifierDeps.map((dep: any) => {
		let dep_badge_id = dep.badgeType.badgeTypeID
		let badge_type_data = _.find(dao.badgeTypes, { badgeTypeID: dep_badge_id })
		return {
			badge_name: badge_type_data.name,
			badge_url: badge_type_data.metadataURI
		}
	})

	// console.log(quest_type)
	let claim_reward: any = _.find(dao.badgeTypes, { badgeTypeID: quest_type.contributorBadgeTypeID })
	let validator_reward: any = _.find(dao.badgeTypes, { badgeTypeID: quest_type.verifierBadgeTypeID })

	if (claim_reward) {
		claim_reward = {
			badge_name: claim_reward.name,
			badge_url: claim_reward.metadataURI
		}
	}

	if (validator_reward) {
		validator_reward = {
			badge_name: validator_reward.name,
			badge_url: validator_reward.metadataURI
		}
	}

	return <div
		className='h-auto w-full my-4 max-w-md'>
		<Link href={"/claim_quest?quest_id=" + quest.questID}>
			<QuestCard
				key={quest.questID}
				requiredStakeAmount={quest.requiredStake}
				details={quest.name}
				isClaimed={is_claimed}
				isLocked={is_locked}
				requiredStakeToken={'ETH'}
				claimantDependencies={claimant_deps}
				validatorDependencies={validator_deps}
				claimCount={quest.claims.length}
				availCount={quest.limitContributions}
				claimantReward={claim_reward}
				validatorReward={validator_reward}
			></QuestCard>
		</Link>
	</div>
}