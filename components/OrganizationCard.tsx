import Card from './Card'
import Badge from './Badge'

export default function ({ name, badge_url }: any) {
	return <Card>
		<div className="flex flex-row items-center">
			<Badge size={2} img={badge_url}></Badge>
			<div className="w-2 h-10 rounded-xl bg-yellow-500 mx-5"></div>
			<div className="flex flex-col">
				<span className='text-base-500 text-sm'>organization:</span>
				<span className='text-base-100 text-xl'>{name}</span>
			</div>
		</div>
	</Card >

}