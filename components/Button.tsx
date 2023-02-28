export default function Button({ children, onClick }: any) {
	return <div onClick={onClick} className="p-3 bg-blue-500 rounded-xl px-6 border-2 border-blue-400 flex w-fit cursor-pointer hover:bg-blue-400">
		{children}
	</div>
}