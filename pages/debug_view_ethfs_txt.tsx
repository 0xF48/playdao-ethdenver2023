import type { NextPage } from 'next';
import * as ethers from "ethers";
import {useEffect, useState} from "react";

const DebugViewETHFSImage: NextPage = () => {
	const [text, setText] = useState("");

	useEffect(() => {
		const contract = new ethers.Contract(
			// ETHFS contract address
			'0xd4C747bDE076B5c9340ae4aFeab0611970Ea0e68',
			// ABI
			[
				"function size(bytes name) external view returns (uint256, uint256)",
				"function read(bytes name) external view returns (bytes data, bool exist)",
				"function readChunk(bytes name, uint256 chunkId) external view returns (bytes chunkData, bool exist)"
			],
			// PROVIDER
			new ethers.providers.JsonRpcProvider(
				// TODO: Please input a JSONRPC URL
				"https://...."
				)
		);

		const filename = ethers.utils.toUtf8Bytes(
			// filename
			"0x069befd25a09dc271ef9d11052cf0b4f0ef136715f9ed746643bb9ab032b61b7.txt"
		);

		(async () => {
			const [size, numChunk] = await contract.size(
				filename
			)

			let txt = ""
			for(let i=0; i<numChunk.toNumber(); i++) {
				const [chunk, exist] = await contract.readChunk(filename, i);
				if (!exist) {
					break
				}

				const bytes = ethers.utils.arrayify(chunk);

				txt += Buffer.from(bytes.buffer).toString()
			}

			setText(txt);
		})()
	}, []);

	return <div style={{display: "flex", alignItems: "column"}}>
		Hello
		<span>{text}</span>
	</div>
}

export default DebugViewETHFSImage;