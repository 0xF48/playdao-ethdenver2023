import type { NextPage } from 'next';
import { useETHSFFile } from '../util/contracts/ethsf';

const DebugViewETHFSImage: NextPage = () => {
	const {isLoading, data} = useETHSFFile("0xf9009e987e3cbdbe3a627ed67199de66bdb2ae590d055f07b66a1ee8a8177194.jpeg")

	console.log("data", data);

	return <div style={{display: "flex", alignItems: "column"}}>
		Hello
		{!isLoading && <img src={data!} />}
	</div>
}

export default DebugViewETHFSImage;