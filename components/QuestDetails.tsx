export default function QuestDetails({ colorClass, details }: any) {
	return <div className="flex flex-row items-center w-full">
		<div className={"w-2 h-12 rounded-full " + colorClass}>
		</div>
		<div className="flex flex-col pl-4">
			<div className="text-base-400">quest:</div>
			<div className="text-base-100">{details}</div>
		</div>
	</div>
}