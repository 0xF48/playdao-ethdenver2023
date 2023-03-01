import QuestCard from './QuestCard'
import ClaimantCard from './ClaimantCard'
import cn from 'classnames'
import Button from './Button'
import { useState } from 'react'

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


export default function ValidationView() {

	const [metaSymbol, setMetaSymbol] = useState('')

	return <div>

		<ClaimantCard address='0xc00ac0C9378c8Fc13a1136B839A7e3DC7dDd147A'></ClaimantCard>

		<div className='w-full flex items-center content-center justify-center'>
			<div className='my-4'>wants you to validate</div>
		</div>

		<QuestCard
			details='do 5 pushups'
			validatorDependencies={[
				{
					badge_url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg',
					badge_name: 'trainee'
				}
			]}
		/>

		<div className='w-full py-3'>
			<div className='w-full flex items-center content-center justify-center'>
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='👍' />
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='😑' />
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='🦄' />
				<EmojiButtonComponent select={metaSymbol} onSelect={setMetaSymbol} symbol='💩' />
			</div>
		</div>
		<div className='w-full flex flex-row items-center content-center justify-center'>
			<Button>validate</Button>
		</div>
	</div>
}