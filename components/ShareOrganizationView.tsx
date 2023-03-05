import OrganizationCard from './OrganizationCard'
import QR from './QR'
import Button from './Button'
import { useRouter } from 'next/router'
import { useOrganization } from '../util/hooks'

export default function () {
	const router = useRouter();
	const { dao_id } = router.query;
	let { loading, data, error } = useOrganization(dao_id)

	if (error) {
		return <div>{error.message}</div>
	}

	var org_qr_url = ""
	if (data && data.dao) {
		var org_qr_url = process.env.NEXT_PUBLIC_HOST + '/quests?dao_id=' + data.dao.daoID
	}
	if (!loading && !org_qr_url) {
		// return <div className='w-full flex flex-col items-center content-center justify-center'>
		// 	<input className='rounded-lg text-white bg-base-800 border-3 border-base-800 text-thick p-4'>
		// 	</input>
		// 	<Link className='bg-blue-500 p-2 rounded-lg m-3'>add new dao</Link>
		// </div>
		return <div>add organization with ?dao_id=</div>
	}
	if (!org_qr_url) {
		return <div>loading organization...</div>
	}
	if (!process.env.NEXT_PUBLIC_HOST) {
		return <div>process.env.NEXT_PUBLIC_HOST not set</div>
	}

	// console.log(data.dao)

	return <div className="flex flex-col items-center w-full justify-center">
		<OrganizationCard
			name='workoutDAO'
			badge_url={'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'} />
		<div className='p-5 text-2xl'>
			Share Your ORG "{data?.dao?.daoID}"
		</div>
		<QR url={org_qr_url}></QR>
	</div>
}