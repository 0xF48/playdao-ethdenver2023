export default function ({ children, borderClass = 'border-red-500' }: any) {

	return <div className={"rounded-3xl p-5 px-8 bg-black border-4 " + borderClass}>
		{children}
	</div>
}