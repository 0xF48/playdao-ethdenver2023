import Badge from "./Badge";
import Card from './Card';

function firstFourAndLastFour(str: string) {
	return str.slice(0, 4) + '...' + str.slice(-6)
}

export default function BadgeCard({ claimID, attestation, badge_url, badge_name }: any) {
	return <div className="p-3 text-white"><Card>
		<div className="flex flex-col items-center">
			<Badge img={badge_url}></Badge>
			<div className="text-center mt-3 mb-2">{badge_name}</div>
			<div className="bg-red-500 text-sm rounded-lg px-2 py-1 mb-2"><span className="text-red-200">attestation:</span> {attestation && firstFourAndLastFour(attestation)}</div>
			<div className="bg-blue-500 text-sm rounded-lg px-2 py-1 w-full"><span className="text-blue-200">claimID:</span> {claimID}</div>
		</div>
	</Card>
	</div>
}