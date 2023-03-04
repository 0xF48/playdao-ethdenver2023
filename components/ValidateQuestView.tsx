import QuestCardAPIWrapper from './QuestCardAPIWrapper'
import ClaimantCard from './ClaimantCard'
import cn from 'classnames'
import Button from './Button'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuest, useCompleteQuest } from '../util/hooks'
import ErrorView from './ErrorView'
import LoadingView from './LoadingView'


//emoji button component
function EmojiButtonComponent({ symbol, select, onSelect }: any) {
	let onSelectCb = () => {
		onSelect(symbol)
	}
	return <div onClick={onSelectCb} className={
		cn({ 'w-16 h-16 rounded-full bg-black flex items-center content-center justify-center m-3 cursor-pointer hover:bg-blue-600 border-4 ': true, 'border-blue-900': select != symbol, 'bg-blue-600 border-blue-500': select == symbol })
	}>
		<div className='text-2xl'>{symbol}</div>
	</div>
}


export default function ValidateQuestView() {

	const [metaSymbol, setMetaSymbol] = useState('') //some metadata
	const [metadata, setMetadata] = useState('') //score
	const router = useRouter();
	const { dao_id, quest_id, claim_id } = router.query;
	let { loading: complete_loading, is_done, error, completeQuest } = useCompleteQuest(quest_id, String(claim_id), metadata, String(metaSymbol), String(dao_id))
	let { quest_loading, quest, quest_error } = useQuest(quest_id)

	if (!dao_id || !quest_id || !claim_id) {
		return <div>missing dao_id,quest_id,claim_id</div>
	}
	if (quest_loading) {
		return <div>loading...</div>
	}

	var claimant_addr = ''

	quest.claims.forEach((claim: any) => {
		if (claim.claimID == claim_id) {
			claimant_addr = claim.claimedBy
		}
	})

	console.log(quest)

	async function validateQuest() {
		completeQuest()
	}

	if (error) {
		return <ErrorView error={error} />
	}

	if (complete_loading) {
		return <LoadingView />
	}

	else if (is_done) {
		return <div>quest is now complete and the stake has been returned to the claimant</div>
	}



	return <div>

		<ClaimantCard address={claimant_addr}></ClaimantCard>

		<div className='w-full flex items-center content-center justify-center'>
			<div className='my-4'>wants you to validate</div>
		</div>

		<QuestCardAPIWrapper questId={quest_id} />

		<div className='w-full py-3'>
			<div className='w-full flex items-center content-center justify-center'>
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='👍' />
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='😑' />
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='🦄' />
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='💩' />
			</div>
		</div>
		<div className='w-full flex flex-row items-center content-center justify-center'>
			<Button onClick={validateQuest} > validate </Button>
		</div>
	</div>
}