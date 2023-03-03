import { ethers } from "hardhat";
import {
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

  const [signer] = await ethers.getSigners();

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

  // const tx5 = await playDAO.claimQuest(daoID, questID);
  // const res5 = await tx5.wait();
  // const claimID = 1;
  // console.log("Claimed Quest 1", claimID);

  // const tx6 = await playDAO
  //   .connect(account1)
  //   .completeQuest(daoID, questID, claimID, "ipfs:proof", "👍");
  // const res6 = await tx6.wait();
  // console.log("Completed Claim 1");

  // const tx7 = await playDAO.createQuestType(
  //   daoID,
  //   "QuestType2",
  //   "ipfs:QuestType2",
  //   badgeTypeID,
  //   badgeTypeID,
  //   [badgeTypeID],
  //   [badgeTypeID],
  //   [badgeTypeID]
  // );
  // await tx7.wait();
  // const questTypeID2 = 2;
  // console.log("Created Quest Type 2", questTypeID2);

  // const tx8 = await playDAO
  //   .connect(account1)
  //   .startQuest(daoID, questTypeID2, "Quest2", "ipfs:Quest2", 1, 1);
  // const res8 = await tx8.wait();
  // const questID2 = 2;
  // console.log("Started Quest 2", questID2);

  // const tx9 = await playDAO
  //   .connect(account1)
  //   .claimQuest(daoID, questID2, { value: 1 });
  // const res9 = await tx9.wait();
  // const claimID2 = 1;
  // console.log("Claimed Quest 2", claimID);

  // const tx10 = await playDAO.completeQuest(
  //   daoID,
  //   questID2,
  //   claimID2,
  //   "ipfs:proof",
  //   "👍"
  // );
  // const res10 = await tx10.wait();
  // console.log("Completed Quest 2", 1);
}

// Quests in QuestType

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
