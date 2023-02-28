import Button from "./Button"

export default function ClaimButton({ onClick, claimAmount, claimToken, isClaimed, isLocked }: any) {

	let text = 'claim'

	if (isLocked) {
		text = 'locked'
	}

	if (isClaimed) {
		text = 'show QR'
	}


	return <Button onClick={onClick} colorClass=''>
		<div className="flex flex-row">
			<div>{claimAmount}</div>
			<div>{claimToken}</div>
			<div className="w-3 h-5 rounded-md bg-white/50 mx-3" />
			{text}
		</div>
	</Button>
}