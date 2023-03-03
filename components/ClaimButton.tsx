import Button from "./Button"
import { useClaimQuest, useQuest } from "../util/hooks"

export default function ClaimButton({ quest_id, dao_id, claimAmount, claimToken, isClaimed, isLocked }: any) {
	console.log(quest_id, dao_id, claimAmount, claimToken, isClaimed, isLocked)

	let { loading, write } = useClaimQuest(Number(quest_id) || 0, Number(dao_id) || 0, claimAmount)

	let { quest_loading, quest, quest_type, quest_error } = useQuest(quest_id)
	console.log(quest)

	let text = 'claim'

	if (isLocked) {
		text = 'locked'
	}

	if (isClaimed) {
		text = 'claimed'
	}

	let onClick = () => {
	}

	return <Button onClick={onClick} colorClass='bg-red-500'>
		<div className="flex flex-row items-center">
			<div className="mr-3">{claimAmount}</div>
			<div>{claimToken}</div>
			<div className="w-2 h-5 rounded-md bg-white/50 mx-3" />
			{text}
		</div>
	</Button>
}