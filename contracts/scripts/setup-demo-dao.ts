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

const BADGE_CONTRACT_ADDRESS = process.env.BADGE_CONTRACT_ADDRESS;
const PLAY_DAO_CONTRACT_ADDRESS = process.env.PLAY_DAO_CONTRACT_ADDRESS;

async function main() {
  if (!PLAY_DAO_CONTRACT_ADDRESS) {
    throw new Error("PLAY_DAO_CONTRACT_ADDRESS is not set in env");
  }
  if (!BADGE_CONTRACT_ADDRESS) {
    throw new Error("BADGE_CONTRACT_ADDRESS is not set in env");
  }

  const [signer, account] = await ethers.getSigners();

  const daoID = await createDAO(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    BADGE_CONTRACT_ADDRESS!,
    "New DAO",
    "ipfs:dao",
    signer.address
  );

  console.log("dao created", daoID.toHexString());

  const contributorBadgeTypeID = await createBadgeType(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    "contributor badge",
    "ipfs:contributor_badge"
  );

  console.log(
    "create contributor badge type",
    contributorBadgeTypeID.toHexString()
  );

  const verifierBadgeTypeID = await createBadgeType(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    "verifier badge",
    "ipfs:verifier_badge"
  );

  console.log("create verifier badge type", verifierBadgeTypeID.toHexString());

  const questTypeID = await createQuestType(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    "quest type 1",
    "ipfs:quest_type_1",
    contributorBadgeTypeID,
    verifierBadgeTypeID,
    [],
    [],
    []
  );

  console.log("created quest type", questTypeID);

  const questID = await startQuest(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    questTypeID,
    "new quest 1",
    "ipfs:quest_1",
    1000,
    0
  );

  console.log("started quest", questID.toHexString());

  const claimID = await claimQuest(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    questID
  );

  console.log("claimed quest", claimID.toHexString());

  await completeQuest(
    account,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    questID,
    claimID,
    "hoge",
    "fuga"
  );

  console.log("claim comleted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
