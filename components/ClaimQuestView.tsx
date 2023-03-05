
import QuestCardAPIWrapper from "./QuestCardAPIWrapper"
import { useClaimQuest, useOrganization, useQuest } from '../util/hooks'
import { useRouter } from 'next/router'
import Button from './Button'
import { useAccount } from "wagmi"
import QR from "./QR"
import ErrorView from "./ErrorView"
import LoadingView from "./LoadingView"
import { useApolloClient } from "@apollo/client"
import { useEffect } from "react"
import { QUERY_DAO } from "../util/queries"

export default function ClaimQuestView() {

	const router = useRouter();
	const { address, isConnected, isConnecting } = useAccount();
	const { quest_id } = router.query;
	const client = useApolloClient()

	let { quest_loading, quest, quest_error } = useQuest(quest_id)
	if (quest) {
		var requiredStakeAmount = quest.requiredStake
	}



	let { data: dao_data } = useOrganization()
	let dao_id = dao_data?.dao?.id

	let { loading, error, claimQuest, claim_id } = useClaimQuest(Number(quest_id) || 0, Number(dao_id) || 0, requiredStakeAmount)




	var can_claim = false
	let text = 'claim'
	if (quest && quest.claims.length < quest.limitContributions) {
		var can_claim = true
	} else {
		text = 'no more claims'
	}

	let my_claims: any = []
	let ongoing_claim = undefined
	quest?.claims.forEach((claim: any) => {
		// console.log(address, claim.claimedBy)
		if (String(claim.claimedBy).toLowerCase() === String(address).toLocaleLowerCase()) {
			my_claims.push(claim)
		}
	})

	my_claims.forEach((my_claim: any) => {
		if (my_claim.status == 'ongoing') {
			can_claim = false
			ongoing_claim = my_claim
		}
	})

	// console.log(my_claims)
	console.log(my_claims)
	if (ongoing_claim) {
		//@ts-ignore
		claim_id = ongoing_claim.claimID
	}



	// useEffect(() => {
	// 	console.log('refetch')
	// 	client.refetchQueries({
	// 		include: [QUERY_DAO],
	// 	});
	// }, [claim_id])

	let onClaimClick = async () => {
		await claimQuest()
		console.log("DONE")
		client.refetchQueries({
			include: [QUERY_DAO],
		});
	}



	if (quest_loading) {
		return <div>loading...</div>
	} else if (claim_id) {

	}

	if (error) {
		return <ErrorView error={error}></ErrorView>
	}

	if (loading) {
		var claim_button = <Button colorClass='bg-base-800 text-base-500'>
			loading...
		</Button>
	} else if (claim_id) {
		var validate_quest_url = process.env.NEXT_PUBLIC_HOST + '/validate?dao_id=' + dao_id + '&quest_id=' + quest_id + '&claim_id=' + claim_id

		var claim_button = <div>
			<QR url={validate_quest_url}></QR>
			<div className="text-center text-white flex w-full items-center content-center justify-center">{
				<Button onClick={onClaimClick}>claim again</Button>
			}</div>
		</div>
	} else {
		var claim_button = <Button onClick={onClaimClick} colorClass={can_claim && 'text-white bg-blue-600 hover:bg-blue-500 border-4 p-6 text-2xl px-8 border-blue-500 transition-all hover:scale-110 '}>
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
		{/* <div>total claims : {quest.claims.length} / {quest.limitContributions}</div> */}
		{my_claims.length && <div>my claims:</div> || null}
		{my_claims.length && <div>{my_claims.map((claim: any) => {
			return <span className='bg-gray-200 p-2 rounded-xl m-3' key={claim.claimID}>claimID: {claim.claimID}</span>
		})}</div> || null}
		<div className="mb-1 mt-10"></div>
		{dao_data && claim_button}
	</div>
}