import Badge from './Badge'

export default function BadgeMiniComponent({ badge_url, bar_class, prefix, badge_name }: any) {
	return <div className="flex flex-row items-center m-3">
		<Badge img={badge_url}></Badge>
		<div className={"w-3 h-12 rounded-md mx-4 " + bar_class}></div>
		<div className='flex flex-col'>
			<span className='text-base-500'>{prefix}</span>
			<span className='text-base-100'>{badge_name}</span>
		</div>
	</div>
}