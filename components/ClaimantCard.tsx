
function firstFourAndLastFour(str: string) {
	return str.slice(0, 4) + '...' + str.slice(-6)
}
export default function ClaimantCard({ address }: any) {
	return <div className="flex flex-row items-center justify-center bg-white p-4 text-black rounded-2xl">
		{firstFourAndLastFour(address)}
	</div>
}