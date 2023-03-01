import QuestCard from './QuestCard'
import Button from './Button'
import { useQuery } from '@apollo/client'

import { QUESTS_QUERY } from '../queries'

export default function () {

	const {
		loading: quests_loading,
		data,
		error: query_error,
	} = useQuery(QUESTS_QUERY, {
		variables: {
			first: 500,
		},
	});

	console.log(quests_loading, data)

	return <div className="flex flex-col items-center w-full justify-center">
		<div>test</div>
		{/* <QuestCard
			details='do 5 pushups'
			requiredStakeAmount={0.5}
			requiredStakeToken='ETH'
			isLocked={false}
			isClaimed={true}
			claimantDependencies={[
				{
					badge_url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg',
					badge_name: 'trainee'
				}
			]}
			validatorDependencies={[
				{
					badge_url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg',
					badge_name: 'trainee'
				}
			]}
			claimantReward={{
				badge_url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg',
				badge_name: 'recruiter'
			}}
			validatorReward={{
				badge_url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg',
				badge_name: 'recruiter'
			}}
		/> */}
	</div>
}