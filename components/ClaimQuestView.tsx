
import QuestCardAPIWrapper from "./QuestCardAPIWrapper"
import { useClaimQuest, useOrganization, useQuest } from '../util/hooks'
import { useRouter } from 'next/router'
import Button from './Button'
import { useAccount } from "wagmi"
import QR from "./QR"
import ErrorView from "./ErrorView"
import LoadingView from "./LoadingView"

export default function ClaimQuestView() {

	const router = useRouter();
	const { address, isConnected, isConnecting } = useAccount();
	const { quest_id } = router.query;

	let { quest_loading, quest, quest_error } = useQuest(quest_id)
	if (quest) {
		var requiredStakeAmount = quest.requiredStake
	}

	let { data: dao_data } = useOrganization()
	let dao_id = dao_data?.dao.id
	let { loading, error, claimQuest, claim_id } = useClaimQuest(Number(quest_id) || 0, Number(dao_id) || 0, requiredStakeAmount)

	if (quest_loading) {
		return <div>loading...</div>
	}

	var can_claim = false
	let text = 'claim'
	if (quest.claims.length < quest.limitContributions) {
		var can_claim = true
	} else {
		text = 'no more claims'
	}

	let my_claims: any = []
	quest.claims.forEach((claim: any) => {
		// console.log(address, claim.claimedBy)
		if (String(claim.claimedBy).toLowerCase() === String(address).toLocaleLowerCase()) {
			my_claims.push(claim)
		}
	})

	claim_id = my_claims[my_claims.length - 1]?.claimID

	let onClaimClick = () => {
		claimQuest()
	}

	if (error) {
		return <ErrorView error={error}></ErrorView>
	}

	if (loading) {
		var claim_button = <Button colorClass='bg-base-800 text-base-500'>
			loading...
		</Button>
	} else if (my_claims.length) {
		var validate_quest_url = process.env.NEXT_PUBLIC_HOST + '/validate?dao_id=' + dao_id + '&quest_id=' + quest_id + '&claim_id=' + claim_id

		var claim_button = <div>
			<QR url={validate_quest_url}></QR>
			<div className="text-center text-base-500 flex w-full items-center content-center justify-center">{
				<Button onClick={onClaimClick}>claim again</Button>
			}</div>
		</div>
	} else {
		var claim_button = <Button onClick={onClaimClick} colorClass={can_claim && 'bg-blue-600 hover:bg-blue-500 border-3 border-blue-500 transition-all hover:scale-110 '}>
			<div className="flex flex-row items-center">
				<div className="mr-3">{requiredStakeAmount}</div>
				<div>ETH</div>
				<div className="w-2 h-5 rounded-md bg-white/50 mx-3" />
				{text}
			</div>
		</Button>
	}

	return <div className="flex flex-col items-center w-full justify-center pt-6">
		<QuestCardAPIWrapper questId={quest_id} />
		<div>total claims : {quest.claims.length} / {quest.limitContributions}</div>
		<div>my claims:</div>
		{my_claims && <div>{my_claims.map((claim: any) => {
			return <div key={claim.claimID}>claimID: {claim.claimID}</div>
		})}</div>}
		<div className="mb-1 mt-10"></div>
		{dao_data && claim_button}
	</div>
}