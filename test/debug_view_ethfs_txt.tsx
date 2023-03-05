import type { NextPage } from 'next';
import { useETHSFFile } from '../util/contracts/ethsf';

const DebugViewETHFSImage: NextPage = () => {
	const {data} = useETHSFFile("0x069befd25a09dc271ef9d11052cf0b4f0ef136715f9ed746643bb9ab032b61b7.txt")

	return <div style={{display: "flex", alignItems: "column"}}>
		Hello
		<span>{data}</span>
	</div>
}

export default DebugViewETHFSImage;