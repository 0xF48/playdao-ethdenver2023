import { useEffect, useState } from "react"
import * as ethers from "ethers";

const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_MUMBAI_ETHEREUM_FILE_STORAGE_ADDRESS!,
    // ABI
    [
        "function size(bytes name) external view returns (uint256, uint256)",
        "function read(bytes name) external view returns (bytes data, bool exist)",
        "function readChunk(bytes name, uint256 chunkId) external view returns (bytes chunkData, bool exist)"
    ],
    // PROVIDER
    new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_MUMBAI_RPC_URL!
    )
);

export const useETHSFFile = (
    filename: string,
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setData(null);

		(async () => {
            const fileAddress = ethers.utils.toUtf8Bytes(
                filename,
            );

			const [_size, numChunk] = await contract.size(
				fileAddress
			)

            const txt = (await Promise.all(new Array(numChunk).fill(null).map(async (_e, index) => {
				const [chunk, exist] = await contract.readChunk(fileAddress, index);
				if (!exist) {
                    return null
				}

                return Buffer.from(ethers.utils.arrayify(chunk).buffer).toString()
            })))
            .filter((a): a is string => a !== null)
            .reduce((a, b) => a + b, "");

            setData(txt);
            setIsLoading(false);
		})()
    }, [filename]);
    
    return {
        isLoading,
        data
    }
}