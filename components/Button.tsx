import cn from "classnames"


export default function Button({ colorClass, children, onClick }: any) {
	return <div onClick={onClick} className={cn({
		"p-3 rounded-xl px-6 border-2 flex w-fit cursor-pointer ": true,
		"bg-blue-500 text-white hover:bg-blue-400 border-blue-400": !colorClass
	}) + " " + colorClass}>
		{children}
	</div>
}