import type { NextPage } from 'next';
import * as ethers from "ethers";
import {useEffect, useState} from "react";

const DebugViewETHFSImage: NextPage = () => {
	const [imageURL, setImageURL] = useState("");

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
				// TODO: Please input JSON_RPC URL
				"https://..."
			)
		);

		const filename = ethers.utils.toUtf8Bytes(
			// filename
			"0xf9009e987e3cbdbe3a627ed67199de66bdb2ae590d055f07b66a1ee8a8177194.jpeg"
		);

		(async () => {
			const [size, numChunk] = await contract.size(
				filename
			)

			console.log("file size", size);
			console.log("number of chunks", numChunk);

			let txt = ""
			for(let i=0; i<numChunk.toNumber(); i++) {
				const [chunk, exist] = await contract.readChunk(filename, i);
				if (!exist) {
					break
				}

				const bytes = ethers.utils.arrayify(chunk);

				console.log("bytes", bytes);

				txt += Buffer.from(bytes.buffer).toString()
			}

			setImageURL(txt);
		})()
	}, []);

	console.log("imageURL", imageURL);

	return <div style={{display: "flex", alignItems: "column"}}>
		Hello
		{imageURL !== "" && <img src={imageURL} />}
	</div>
}

export default DebugViewETHFSImage;