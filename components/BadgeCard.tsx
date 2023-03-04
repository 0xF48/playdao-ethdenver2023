import Badge from "./Badge";
import Card from './Card';
export default function BadgeCard({ badge_url, badge_name }: any) {
	return <div className="p-3"><Card>
		<div className="flex flex-col">
			<Badge badge_url={badge_url}></Badge>
			<div className="text-center">{badge_name}</div>
		</div>
	</Card>
	</div>
}