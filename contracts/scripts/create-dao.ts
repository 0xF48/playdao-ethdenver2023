import { ethers } from "hardhat";
import { PlayDAO } from "../typechain-types";

require("dotenv").config();

const BADGE_CONTRACT_ADDRESS = process.env.BADGE_CONTRACT_ADDRESS;
const PLAY_DAO_CONTRACT_ADDRESS = process.env.PLAY_DAO_CONTRACT_ADDRESS;

const parseEtherjsLog = (parsed: any) => {
  let parsedEvent: any = {};
  for (let i = 0; i < parsed.args.length; i++) {
    const input = parsed.eventFragment.inputs[i];
    const arg = parsed.args[i];
    const newObj = { ...input, ...{ value: arg } };
    parsedEvent[input["name"]] = newObj;
  }

  return parsedEvent;
};

export const getEthersLog = async (
  contract: PlayDAO,
  filter: any,
  from: number,
  to: number
) => {
  if (contract === undefined || filter === undefined) return;
  const events = await contract.queryFilter(filter, from, to);
  if (events.length === 0) return;

  return events.map((e) => parseEtherjsLog(contract.interface.parseLog(e)));
};

async function main() {
  if (!PLAY_DAO_CONTRACT_ADDRESS) {
    throw new Error("PLAY_DAO_CONTRACT_ADDRESS is not set in env");
  }
  if (!BADGE_CONTRACT_ADDRESS) {
    throw new Error("BADGE_CONTRACT_ADDRESS is not set in env");
  }

  const [signer, account1] = await ethers.getSigners();
  const BadgeFactory = await ethers.getContractFactory("Badge");
  const badge = await BadgeFactory.attach(BADGE_CONTRACT_ADDRESS);

  const PlayDAOFactory = await ethers.getContractFactory("PlayDAO");
  const playDAO = await PlayDAOFactory.attach(PLAY_DAO_CONTRACT_ADDRESS);

  const tx0 = await badge.grantMinterRole(playDAO.address);
  await tx0.wait();

  const tx1 = await playDAO.createDAO(
    "Test DAO1",
    "ipfs:DAO1",
    BADGE_CONTRACT_ADDRESS,
    signer.address
  );
  const res1 = await tx1.wait();
  const daoID = await playDAO.totalDAOs();
  console.log("Created DAO", daoID);

  const tx2 = await playDAO.createBadgeType(
    daoID,
    "BadgeType1",
    "ipfs:BadgeType1"
  );
  const res2 = await tx2.wait();
  const badgeTypeID = 1;
  console.log("Created Badge Type", badgeTypeID);

  const tx3 = await playDAO.createQuestType(
    daoID,
    "QuestType1",
    "ipfs:QuestType1",
    badgeTypeID,
    badgeTypeID,
    [],
    [],
    []
  );
  const res3 = await tx3.wait();
  const questTypeID = 1;
  console.log("Created Quest Type", questTypeID);

  const tx4 = await playDAO.startQuest(
    daoID,
    questTypeID,
    "Quest1",
    "ipfs:Quest1",
    1,
    0
  );
  const res4 = await tx4.wait();
  const questID = 1;
  console.log("Started Quest", questID);

  const tx5 = await playDAO.claimQuest(daoID, questID);
  const res5 = await tx5.wait();
  const claimID = 1;
  console.log("Claimed Quest 1", claimID);

  const tx6 = await playDAO
    .connect(account1)
    .completeQuest(daoID, questID, claimID, "ipfs:proof", "👍");
  const res6 = await tx6.wait();
  console.log("Completed Claim 1");

  const tx7 = await playDAO.createQuestType(
    daoID,
    "QuestType2",
    "ipfs:QuestType2",
    badgeTypeID,
    badgeTypeID,
    [badgeTypeID],
    [badgeTypeID],
    [badgeTypeID]
  );
  await tx7.wait();
  const questTypeID2 = 2;
  console.log("Created Quest Type 2", questTypeID2);

  const tx8 = await playDAO
    .connect(account1)
    .startQuest(daoID, questTypeID2, "Quest2", "ipfs:Quest2", 1, 1);
  const res8 = await tx8.wait();
  const questID2 = 2;
  console.log("Started Quest 2", questID2);

  const tx9 = await playDAO
    .connect(account1)
    .claimQuest(daoID, questID2, { value: 1 });
  const res9 = await tx9.wait();
  const claimID2 = 1;
  console.log("Claimed Quest 2", claimID);

  const tx10 = await playDAO.completeQuest(
    daoID,
    questID2,
    claimID2,
    "ipfs:proof",
    "👍"
  );
  const res10 = await tx10.wait();
  console.log("Completed Quest 2", 1);
}

// Quests in QuestType

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
