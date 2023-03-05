import { LoaderBar } from "./LoaderBar";

export default function ErrorView(error: any) {

	return <div className="w-full pt-24 flex justify-center items-center content-center">
		<div className="bg-blue-500 rounded-xl flex flex-col p-12">
			<LoaderBar loading={true} />
			<div className="mt-5 text-white">
				processing happiness...
			</div>
		</div>
	</div>
}