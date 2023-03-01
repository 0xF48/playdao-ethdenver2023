import OrganizationCard from './OrganizationCard'
import QR from './QR'
import Button from './Button'
import { useRouter } from 'next/router'


export default function () {
	const router = useRouter();
	const { param } = router.query
	console.log(param)

	return <div className="flex flex-col items-center w-full justify-center">
		<OrganizationCard name='workoutDAO' badge_url={'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg'} />
		<div className='p-5'>
			Share Your Organization QR Code for {param}
		</div>
		<QR url='https://www.google.com'></QR>
	</div>
}