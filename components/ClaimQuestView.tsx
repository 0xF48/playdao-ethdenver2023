
import QuestCardAPIWrapper from "./QuestCardAPIWrapper"
import { useClaimQuest, useOrganization, useQuest } from '../util/hooks'
import { useRouter } from 'next/router'
import ClaimButton from './ClaimButton'


export default function ClaimQuestView() {

	const router = useRouter();
	const { quest_id } = router.query;

	let { quest_loading, quest, quest_error } = useQuest(quest_id)
	let { data: dao_data } = useOrganization()

	// console.log(dao_data)

	if (quest) {
		var requiredStakeAmount = quest.requiredStake
	}

	if (quest_loading) {
		return <div>loading...</div>
	}

	return <div className="flex flex-col items-center w-full justify-center pt-6">
		<QuestCardAPIWrapper questId={quest_id} />
		<div>claims : {quest.claims.length} / {quest.limitContributions}</div>
		{/* <div>{quest.claims.map((claim)=>{
			return <div key={claim.claimID}>claimed by </div>
		})</div> */}
		<div className="mb-1 mt-10">claim quest</div>
		{dao_data && <ClaimButton
			quest_id={quest_id}
			dao_id={dao_data.dao.daoID}
			claimAmount={requiredStakeAmount}
			claimToken={'ETH'}
			isClaimed={false}
			isLocked={true}>
		</ClaimButton>}
	</div>
}