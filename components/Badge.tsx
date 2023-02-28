export default function ({ img, extraClass }: any) {
	return <div className={"rounded-full bg-black border-4 border-white overflow-hidden " + extraClass}>
		<div className="w-20 overflow-hidden h-20 rounded-full">
			<img src={img} className='w-full h-auto'></img>
		</div>
	</div>
}