import BadgeMiniComponent from "./BadgeMiniComponent"
import Card from './Card'
import ClaimButton from "./ClaimButton"
import QuestDetails from './QuestDetails'
import SectionLabel from './SectionLabel'

export default function QuestListCard({
	requiredStakeAmount,
	requiredStakeToken,
	details,
	claimantDependencies,
	validatorDependencies,
	claimantReward,
	validatorReward,
	isLocked,
	isClaimed
}: any) {

	let claimant_deps = claimantDependencies.map((badge_stats: any) => {
		return <BadgeMiniComponent
			prefix='depends on:'
			key={badge_stats.badge_url}
			bar_class='bg-red-500'
			badge_name={badge_stats.badge_name}
			badge_url={badge_stats.badge_url}
		/>
	})

	let validator_deps = validatorDependencies.map((badge_stats: any) => {
		return <BadgeMiniComponent
			prefix='validated by:'
			key={badge_stats.badge_url}
			badge_name={badge_stats.badge_name}
			bar_class='bg-red-500'
			badge_url={badge_stats.badge_url}
		/>
	})

	let validator_reward = validatorReward && <BadgeMiniComponent
		prefix='validator gains:'
		bar_class='bg-red-500'
		badge_name={validatorReward.badge_name}
		badge_url={validatorReward.badge_url}
	/>

	let claimant_reward = claimantReward && <BadgeMiniComponent
		prefix='claimant gains:'
		bar_class='bg-red-500'
		badge_name={claimantReward.badge_name}
		badge_url={claimantReward.badge_url}
	/>

	return <Card>
		<div className="flex flex-col items-center">
			<QuestDetails colorClass='bg-red-500' details={details} />
			<SectionLabel label='requirements' />
			{claimant_deps}
			{validator_deps}
			<ClaimButton
				onClick={() => { }}
				claimAmount={requiredStakeAmount}
				claimToken={requiredStakeToken}
				isClaimed={isClaimed}
				isLocked={isLocked}>
			</ClaimButton>
			<SectionLabel label='rewards' />
			{validator_reward}
			{claimant_reward}
		</div>
	</Card>
}