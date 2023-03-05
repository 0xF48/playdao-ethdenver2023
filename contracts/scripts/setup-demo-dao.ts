import { BigNumber } from "ethers";
import hre, { ethers } from "hardhat";
import {
  claimQuest,
  completeQuest,
  createBadgeType,
  createDAO,
  createQuestType,
  grantBadge,
  startQuest,
} from "./utils";

require("dotenv").config();

const BADGE_CONTRACT_ADDRESS = process.env.BADGE_CONTRACT_ADDRESS;
const PLAY_DAO_CONTRACT_ADDRESS = process.env.PLAY_DAO_CONTRACT_ADDRESS;

const INITIAL_BADGE_HOLDERS = [
  "0xc00ac0C9378c8Fc13a1136B839A7e3DC7dDd147A",
  "0xF3c4Eee95E9f948361282aAE97DBcDb94eE2c1A6",
];

const DAO_NAME = "trashDAO";
const BADGE_TYPE_NAMES = [
  "Trash Picker",
  "Trash Checker",
  "OG Member",
  "Party Attendee",
  "DAO Voter",
];
const CLAIM_LIMIT = 42;
const SLEEP = 3000;

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

async function main() {
  if (!PLAY_DAO_CONTRACT_ADDRESS) {
    throw new Error("PLAY_DAO_CONTRACT_ADDRESS is not set in env");
  }
  if (!BADGE_CONTRACT_ADDRESS) {
    throw new Error("BADGE_CONTRACT_ADDRESS is not set in env");
  }

  console.log(`Setup Demo DAO in ${hre.network.name}`);
  console.log(`PlayDAO: ${PLAY_DAO_CONTRACT_ADDRESS}`);
  console.log(`BADGE_CONTRACT_ADDRESS: ${BADGE_CONTRACT_ADDRESS}\n`);

  const [signer] = await ethers.getSigners();
  if ((await signer.getBalance()).lt(ethers.utils.parseEther("0.005"))) {
    console.warn("Do you have enough balance?");
  }

  const daoID = await createDAO(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    BADGE_CONTRACT_ADDRESS!,
    DAO_NAME,
    DAO_NAME,
    signer.address
  );

  console.log("DAO Created");
  await sleep(SLEEP);

  let badgeTypeIDs: BigNumber[] = [];
  for (let i = 0; i < BADGE_TYPE_NAMES.length; i++) {
    const badgeTypeID = await createBadgeType(
      signer,
      PLAY_DAO_CONTRACT_ADDRESS!,
      daoID,
      BADGE_TYPE_NAMES[i],
      BADGE_TYPE_NAMES[i]
    );

    badgeTypeIDs.push(badgeTypeID);

    console.log(`Badge ${BADGE_TYPE_NAMES[i]} created`);
    await sleep(SLEEP);

    for (let j = 0; j < INITIAL_BADGE_HOLDERS.length; j++) {
      await grantBadge(
        signer,
        PLAY_DAO_CONTRACT_ADDRESS!,
        daoID,
        badgeTypeID,
        INITIAL_BADGE_HOLDERS[j]
      );

      console.log(
        `Granted a badge ${BADGE_TYPE_NAMES[i]} to ${INITIAL_BADGE_HOLDERS[j]}`
      );
      await sleep(SLEEP);
    }
  }

  const trashTrainingQuestTypeID = await createQuestType(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    "Trash Training",
    "Trash Training",
    badgeTypeIDs[0],
    badgeTypeIDs[2],
    [],
    [],
    [badgeTypeIDs[0]]
  );

  console.log("QuestType 'Trash Training' has been defined");
  await sleep(SLEEP);

  const trashTrainingQuestID1 = await startQuest(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    trashTrainingQuestTypeID,
    "Trash Training",
    "Trash Training",
    CLAIM_LIMIT,
    0
  );

  console.log("Quest 'TrashTraining' has been started");
  await sleep(SLEEP);

  const pickupTrashQuestTypeID = await createQuestType(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    "Pickup Trash",
    "Pickup Trash",
    badgeTypeIDs[1],
    badgeTypeIDs[2],
    [],
    [badgeTypeIDs[0]],
    [badgeTypeIDs[1]]
  );

  console.log("QuestType 'Pickup Trash' has defined");
  await sleep(SLEEP);

  const pickupTrashQuestID1 = await startQuest(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    pickupTrashQuestTypeID,
    "Pickup Trash",
    "Pickup Trash",
    CLAIM_LIMIT,
    0
  );

  console.log("Quest 'Pickup Trash' has started");
  await sleep(SLEEP);

  const secretPartyQuestTypeID = await createQuestType(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    `Super Secret Party at “HERE”`,
    "Super Secret Party at “HERE”",
    badgeTypeIDs[3],
    badgeTypeIDs[4],
    [],
    [badgeTypeIDs[2]],
    [badgeTypeIDs[3]]
  );

  console.log(`QuestType 'Super Secret Party at “HERE”' has been defined`);
  await sleep(SLEEP);

  const secretPartyQuestID1 = await startQuest(
    signer,
    PLAY_DAO_CONTRACT_ADDRESS!,
    daoID,
    secretPartyQuestTypeID,
    `Super Secret Party at “HERE”`,
    "Super Secret Party at “HERE”",
    CLAIM_LIMIT,
    0
  );

  console.log(`QuestType 'Super Secret Party at “HERE”' has started`);

  console.log("\n\nSetup is now complete");
  console.log(`PlayDAO: ${PLAY_DAO_CONTRACT_ADDRESS}`);
  console.log(`Badge: ${BADGE_CONTRACT_ADDRESS}`);
  console.log(`DAO ID: ${daoID}`);
  console.log("Badges");
  for (let i = 0; i < BADGE_TYPE_NAMES.length; i++) {
    console.log(`  ${BADGE_TYPE_NAMES[i]}: ${badgeTypeIDs[i]}`);
  }
  console.log("Quest Types");
  console.log(`  Trash Training`);
  console.log(`    Quest Type: ${trashTrainingQuestTypeID}`);
  console.log(`    Quest: ${trashTrainingQuestID1}`);
  console.log(`  Pickup Trash`);
  console.log(`    Quest Type: ${pickupTrashQuestTypeID}`);
  console.log(`    Quest: ${pickupTrashQuestID1}`);
  console.log(`  Super Secret Party at “HERE”`);
  console.log(`    Quest Type: ${secretPartyQuestTypeID}`);
  console.log(`    Quest: ${secretPartyQuestID1}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
