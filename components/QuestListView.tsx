import QuestCard from './QuestCard'
import Button from './Button'
import { useQuery } from '@apollo/client'
import { useOrganization } from '../util/hooks'
import { useRouter } from 'next/router'
import _ from 'lodash'


export default function () {

	const router = useRouter();
	const { dao_id } = router.query;
	let { loading, data, error } = useOrganization(dao_id)

	if (loading) {
		return <div>loading...</div>
	}
	if (error) {
		return <div>{error.message}</div>
	}

	var quests = []

	if (data && data.dao) {
		let dao = data.dao

		// console.log(dao)

		quests = data.dao.questTypes.map((quest_type: any) => {
			return <div key={quest_type.id}>
				{quest_type.quests.map((quest: any) => {
					let claims_left = Number(quest.limitContributions) - quest.claims.length

					let is_locked = false

					let claimant_deps: any = quest_type.contributorDeps.map((dep: any) => {
						// console.log(dep)
						let dep_badge_id = dep.badgeType.badgeTypeID
						let badge_type_data = _.find(dao.badgeTypes, { badgeTypeID: dep_badge_id })
						// console.log(badge_type_data)
						return {
							badge_name: badge_type_data.name,
							badge_url: ''
						}
					})

					let validator_deps: any = quest_type.verifierDeps.map((dep: any) => {
						// console.log(dep)
						let dep_badge_id = dep.badgeType.badgeTypeID
						let badge_type_data = _.find(dao.badgeTypes, { badgeTypeID: dep_badge_id })
						// console.log(badge_type_data)
						return {
							badge_name: badge_type_data.name,
							badge_url: ''
						}
					})

					let claim_reward: any = _.find(dao.badgeTypes, { badgeTypeID: quest_type.contributorBadgeTypeID })
					let validator_reward: any = _.find(dao.badgeTypes, { badgeTypeID: quest_type.validatorBadgeTypeID })

					if (claim_reward) {
						claim_reward = {
							badge_name: claim_reward.name,
							badge_url: ''
						}
					}

					if (validator_reward) {
						validator_reward = {
							badge_name: validator_reward.name,
							badge_url: ''
						}
					}

					let onClaimCb = () => {
						console.log('claim quest')
					}

					return <div className='h-auto w-full m-4'>
						<QuestCard
							key={quest.id}
							requiredStakeAmount={quest.requiredStake}
							details={quest.name}
							isClaimed={claims_left > 0}
							isLocked={is_locked}
							onClickClaimButton={onClaimCb}
							requiredStakeToken={'ETH'}
							claimantDependencies={claimant_deps}
							validatorDependencies={validator_deps}
							claimantReward={claim_reward}
							validatorReward={validator_reward}
						></QuestCard>
					</div>
				})}
			</div>
		})
	}

	return <div className="flex flex-col items-center w-full justify-center">
		<div>available quests...</div>
		{quests}
	</div>
}