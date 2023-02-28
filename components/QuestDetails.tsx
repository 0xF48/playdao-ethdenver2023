export default function QuestDetails({ colorClass, name }: any) {
	return <div className="flex flex-row">
		<div className={"w-3 h-5 rounded-full " + colorClass}>
		</div>
		<div className="flex flex-col pl-4">
			<div className="text-base-800">quest:</div>
			<div className="text-base-100">{name}</div>
		</div>
	</div>
}