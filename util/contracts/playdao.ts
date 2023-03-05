import * as ethers from "ethers";

//@ts-ignore
// const PLAY_DAO_ABI = require("../../contracts/artifacts/contracts/PlayDAO.sol/PlayDAO.json");

import PLAY_DAO_ABI from '../../contracts/graph/abis/PlayDAO.json'
type MayNumber = ethers.BigNumber | number | string;

// returns DAO ID in hex
export async function createDAO(
  signer: ethers.Signer,
  playDAOAddress: string,
  badgeContractAddress: string,
  name: string,
  metadataURI: string,
  ownerAddress: string
): Promise<string> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.createDAO(
    name,
    metadataURI,
    badgeContractAddress,
    ownerAddress
  );

  const receipt = await tx.wait();
  // @ts-ignore
  const daoCreatedEvent = receipt.events.find((e) => e.event === "DAOCreated");

  return daoCreatedEvent.args["daoID"].toHexString();
}

// returns BadgeType ID in hex
export async function createBadgeType(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  name: string,
  metadataURI: string
): Promise<string> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.createBadgeType(daoID, name, metadataURI);

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "BadgeTypeCreated"
  );

  return daoCreatedEvent.args["badgeTypeID"].toHexString();
}

// returns Quest Type ID in hex
export async function createQuestType(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  name: string,
  metadataURI: string,
  contributorBadgeTypeID: MayNumber,
  verifierBadgeTypeID: MayNumber,
  starterDeps: MayNumber[],
  contributorDeps: MayNumber[],
  verifierDeps: MayNumber[]
): Promise<string> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.createQuestType(
    daoID,
    name,
    metadataURI,
    contributorBadgeTypeID,
    verifierBadgeTypeID,
    starterDeps,
    contributorDeps,
    verifierDeps
  );

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "QuestTypeCreated"
  );

  return daoCreatedEvent.args["questTypeID"].toHexString();
}

// returns Quest ID in hex
export async function startQuest(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questTypeID: MayNumber,
  name: string,
  metadataURI: string,
  numContributors: MayNumber,
  requiredStake: number
): Promise<string> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.startQuest(
    daoID,
    questTypeID,
    name,
    metadataURI,
    numContributors,
    requiredStake
  );

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "QuestStarted"
  );

  return daoCreatedEvent.args["questID"].toHexString();
}

// returns Claim ID in hex
export async function claimQuest(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questID: MayNumber,
  requiredStake: string
): Promise<string> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);
  const tx = await PlayDAO.claimQuest(daoID, questID, { value: ethers.utils.parseEther(requiredStake) });
  const receipt = await tx.wait();
  console.log('receipt', receipt)
  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "QuestClaimed"
  );

  return daoCreatedEvent.args["claimID"].toHexString();
}

export async function cancelClaim(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questID: MayNumber,
  claimID: MayNumber
): Promise<void> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.cancelClaim(daoID, questID, claimID);

  const _ = await tx.wait();

  // const daoCreatedEvent = receipt.events.find(
  //   (e: { event: string }) => e.event === "QuestCanceled"
  // );
  // return daoCreatedEvent.args["claimID"];
}

export async function completeQuest(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questID: MayNumber,
  claimID: MayNumber,
  metadataURI: string,
  score: string
): Promise<void> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.completeQuest(
    daoID,
    questID,
    claimID,
    metadataURI,
    score
  );

  const _ = await tx.wait();

  // const daoCreatedEvent = receipt.events.find(
  //   (e: { event: string }) => e.event === "QuestCompleted"
  // );

  // return daoCreatedEvent.args["claimID"];
}
