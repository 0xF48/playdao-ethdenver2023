import type { NextPage } from "next";
import { useState, useEffect } from "react";
import * as ethers from "ethers";

const LoadImageExample: NextPage = () => {
  const filename = "I86rTVl.jpg";

  const [hexData, setHexData] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const contract = new ethers.Contract(
        "0x121937c2fa989dd99a3097b44496b9fcd85777ed",
        [
          "function size(bytes name) external view returns (uint256, uint256)",
          "function read(bytes name) external view returns (bytes, bool)",
          "function countChunks(bytes name) external view returns (uint256)",
        ],
        new ethers.providers.JsonRpcProvider(
          "https://polygon-mumbai.g.alchemy.com/v2/nwBZtFM0j-XaCN4YGZRIZFlT0dVEITFq"
        )
      );

      const numChunks = await contract.countChunks(
        ethers.utils.toUtf8Bytes(filename)
      );

      console.log("num chunks", numChunks);

      const data = [];

      for (let i = 0; i < numChunks.toNumber(); i++) {
        const [data, _exists] = await contract.read(
          ethers.utils.toUtf8Bytes(filename)
        );

        const hexData = Uint8Array.from(Buffer.from(data, "hex"));

        setHexData(hexData as any);
      }
    })();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "column" }}>
      {hexData && <img src={`data:image/jpeg;base64,${btoa(hexData)}`} />}
    </div>
  );
};

export default LoadImageExample;
