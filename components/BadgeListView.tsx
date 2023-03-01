import BadgeCard from './BadgeCard'
export default function BadgeListView() {


	let badges = [
		{
			name: 'PlayDAO Founder',
			url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'
		}
	]

	let badge_cards = badges.map((badge: any) => {
		return <BadgeCard key={badge.name} badge_name={badge.name}></BadgeCard>
	})

	return <div className="flex flex-col items-center w-full justify-center">
		{badge_cards}
	</div>
}
