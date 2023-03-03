import QuestCard from "./QuestCard"
import { useOrganization, useQuest } from '../util/hooks'
import { useRouter } from 'next/router'

export default function ClaimQuestView() {

	const router = useRouter();
	const { quest_id } = router.query;
	let { loading, claimQuest, quest_data, error } = useQuest(quest_id)


	let onClickClaimButton = () => {
		console.log('claim quest')
	}

	return <div className="flex flex-col items-center w-full justify-center pt-6">
		<QuestCard
			details='do 5 pushups'
			validatorDependencies={[
				{
					badge_url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg',
					badge_name: 'trainee'
				}
			]}
		/>

		<div className="mb-1 mt-10">claim quest</div>
		{/* <ClaimButton
			onClick={onClickClaimButton}
			claimAmount={requiredStakeAmount}
			claimToken={'ETH'}
			isClaimed={false}
			isLocked={false}>
		</ClaimButton> */}
	</div>
}