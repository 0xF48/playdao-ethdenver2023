import Badge from "./Badge";
import Card from './Card';
export default function BadgeCard({ badge_url, badge_name }: any) {
	return <Card>
		<div className="flex flex-row">
			<Badge badge_url={badge_url}></Badge>
		</div>
	</Card>
}