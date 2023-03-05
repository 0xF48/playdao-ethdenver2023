import Badge from "./Badge";
import Card from './Card';
export default function BadgeCard({ badge_url, badge_name }: any) {
	return <div className="p-3 text-white"><Card>
		<div className="flex flex-col items-center">
			<Badge badge_url={badge_url}></Badge>
			<div className="text-center mt-3">{badge_name}</div>
		</div>
	</Card>
	</div>
}