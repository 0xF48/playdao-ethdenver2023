

export default function ErrorView(error: any) {
	return <pre className="rounded-xl w-md bg-red-500 text-white p-12 max-w-lg whitespace-pre-wrap overflow-scroll">{error.error?.message || error.message || 'unknown error'}</pre>
}