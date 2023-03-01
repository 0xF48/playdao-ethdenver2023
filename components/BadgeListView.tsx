import BadgeCard from './BadgeCard'
export default function BadgeListView() {


	let badges = [
		{
			name: 'PlayDAO Founder',
			url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'
		},
		{
			name: 'PlayDAO Founder 2',
			url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'
		},
		{
			name: 'PlayDAO Founder 3',
			url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'
		}
	]

	let badge_cards = badges.map((badge: any) => {
		return <div className='col-span-1 p-2 gap-4'>
			<BadgeCard key={badge.name} badge_name={badge.name}></BadgeCard>
		</div>
	})

	return <div className='w-full'>
		<div className='flex flex-row items-center justify-center my-4'>my badges</div>
		<div className="w-full grid grid-cols-2 col-span-2">
			{badge_cards}
		</div>
	</div>


}
