import BadgeMiniComponent from "./BadgeMiniComponent"
import Card from './Card'
import QuestDetails from './QuestDetails'
import SectionLabel from './SectionLabel'

export default function QuestCard({
	requiredStakeAmount,
	requiredStakeToken,
	details,
	onClickClaimButton,
	claimCount,
	availCount,
	claimantDependencies = [],
	validatorDependencies = [],
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

	let no_deps = claimantDependencies.length == 0 && validatorDependencies.length == 0

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
		<div className="flex flex-col items-start">
			<QuestDetails colorClass='bg-red-500' details={details} />
			{!no_deps && <SectionLabel label='dependencies' />}
			{claimant_deps}
			{validator_deps}
			{(validator_reward || claimant_reward) && <SectionLabel label='rewards' />}
			{validator_reward}
			{claimant_reward}
			<div className="mt-3 text-md text-base-500">
				{claimCount} / {availCount} claimed
			</div>
		</div>
	</Card>
}