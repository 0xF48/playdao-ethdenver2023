import cn from 'classnames';

export default function Badge({ img, extraClass, size = 2 }: any) {
	return <div className={"m-1 shrink-0 rounded-full bg-black border-2 border-white overflow-hidden " + extraClass + " " + cn({
		"overflow-hidden rounded-full m-0": true,
		"h-20 w-20": size == 2,
		"h-18 w-18": size == 1,
	})}>

		<img src={img} className=' bg-yellow-500 min-w-full min-h-full' ></img>

	</div >
}