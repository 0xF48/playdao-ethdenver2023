export default function ({ img, extraClass, size = 20 }: any) {
	return <div className={"m-1 rounded-full bg-black border-2 border-white overflow-hidden " + extraClass}>
		<div className={"overflow-hidden rounded-full h-" + String(size) + ' w-' + String(size)}>
			<img src={img} className='w-full h-auto'></img>
		</div>
	</div>
}