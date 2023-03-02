import QuestCard from './QuestCard'
import Button from './Button'
import { useQuery } from '@apollo/client'
import { useOrganization } from '../util/hooks'
import { useRouter } from 'next/router'

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
		quests = data.dao.questTypes.map((quest_type: any) => {
			return <div key={quest_type.id}>
				{quest_type.quests.map((quest: any) => {
					let claims_left = Number(quest.limitContributions) - quest.claims.length
					let is_locked = false

					let claimant_deps: any = []
					let validator_deps: any = []

					let claim_reward: any = {}
					let validator_reward: any = {}

					return <QuestCard
						key={quest.id}
						requiredStakeAmount={quest.requiredStake}
						details={quest.name}
						isClaimed={claims_left > 0}
						isLocked={is_locked}
						claimantDependencies={claimant_deps}
						validatorDependencies={validator_deps}
						claimantReward={claim_reward}
						validatorReward={validator_reward}
					></QuestCard>
				})}
			</div>
		})
	}

	return <div className="flex flex-col items-center w-full justify-center">
		<div>available quests...</div>
		{quests}
	</div>
}