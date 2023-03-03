import cn from 'classnames';

export default function ({ img, extraClass, size = 2 }: any) {
	return <div className={"m-1 rounded-full bg-black border-2 border-white overflow-hidden " + extraClass}>
		<div className={cn({
			"overflow-hidden rounded-full": true,
			"h-24 w-24": size == 2,
			"h-18 w-18": size == 1,
		})}>
			<img src={img} className='w-full h-auto'></img>
		</div>
	</div >
}