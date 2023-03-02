import QuestCard from "./QuestCard"
import QR from './QR'
import { useRouter } from 'next/router'
import { useOrganization } from '../util/hooks'


export default function RequestValidationView() {

	const router = useRouter();
	const { dao_id } = router.query;
	let { loading, data, error } = useOrganization(dao_id)


	return <div className="flex flex-col items-center w-full justify-center pt-6">
		<QuestCard
			details='do 5 pushups'
			validatorDependencies={[
				{
					badge_url: 'https://bafybeiblp4fqe5ctff5766k6uk4hulu2goqofcen2mtcxdb247dtghrvnm.ipfs.w3s.link/trainee.jpg',
					badge_name: 'trainee'
				}
			]}
		/>
		<div className="mb-1 mt-10">validator QR Code</div>
		<QR url={'https://google.com'} />
	</div>
}