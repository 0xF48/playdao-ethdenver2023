import Badge from './Badge'

export default function BadgeMiniComponent({ badge_url, bar_class, prefix, badge_name }: any) {
	return <div className="flex flex-row">
		<Badge img={badge_url}></Badge>
		<div className={"w-3 h-12 " + bar_class}></div>
		<div className='flex flex-col'>
			<span className='text-base-800'>{prefix}</span>
			<span className='text-base-200'>{badge_name}</span>
		</div>
	</div>
}