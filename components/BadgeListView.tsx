import BadgeCard from './BadgeCard'
export default function BadgeListView({ badges }: any) {
	let badge_cards = badges.map((badge: any) => {
		return <BadgeCard badge_name={badge.name}></BadgeCard>
	})

	return <div className="flex flex-col items-center w-full justify-center">
		{badge_cards}
	</div>
}
