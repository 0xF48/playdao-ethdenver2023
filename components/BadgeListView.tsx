import BadgeCard from './BadgeCard'
import { useOrganization, useMyBadges } from '../util/hooks'
import { useRouter } from 'next/router'

export default function BadgeListView() {


	const router = useRouter();
	const { dao_id, quest_id, claim_id } = router.query;
	let { loading, data, error } = useOrganization(dao_id)
	let { badges, loading: badges_loading, error: badges_error } = useMyBadges()

	// console.log(badges, badges_loading, badges_error)

	if (badges) {
		badges = badges.map((badge: any) => {
			// console.log(badge.attestationKey)
			return <BadgeCard claimID={badge.hist.claimID} attestation={badge.hist.attestationKey} key={badge.metadataURI} badge_url={badge.metadataURI} badge_name={badge.name}></BadgeCard>
		})
	}

	// let badges = [
	// 	{
	// 		name: 'PlayDAO Founder',
	// 		url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'
	// 	},
	// 	{
	// 		name: 'PlayDAO Founder 2',
	// 		url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'
	// 	},
	// 	{
	// 		name: 'PlayDAO Founder 3',
	// 		url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'
	// 	}
	// ]

	// let badge_cards = badges.map((badge: any) => {
	// 	return <div className='col-span-1 p-2 gap-4'>
	// 		<BadgeCard key={badge.name} badge_name={badge.name}></BadgeCard>
	// 	</div>
	// })

	return <div className='w-full'>
		<div className='font-extrabold text-2xl text-black'>MY BADGES</div>
		<div className="w-full grid grid-cols-2 col-span-2">
			{badges}
		</div>
	</div>
}
