import { Interface } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  claimQuest,
  completeQuest,
  createBadgeType,
  createDAO,
  createQuestType,
  startQuest,
} from "./utils";

require("dotenv").config();

const ETHFS_ADDRESS = "0x121937C2fa989dD99A3097b44496b9Fcd85777Ed";

async function main() {
  const signers = await ethers.getSigners();
  const contract = new ethers.Contract(ETHFS_ADDRESS, [
    "function size(bytes name) external view returns (uint256, uint256)",
    "function read(bytes name) external view returns (bytes, bool)",
  ]).connect(signers[0]);

  console.log(
    "size",
    await contract.size(ethers.utils.toUtf8Bytes("tmp_data"))
  );

  const { data, exist } = await contract.read(
    ethers.utils.toUtf8Bytes("tmp_data")
  );
  if (exist) {
    console.log("data", ethers.utils.toUtf8String(data));
  }
}

// Quests in QuestType

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
