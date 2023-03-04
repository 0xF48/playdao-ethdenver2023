import * as ethers from "ethers";

const PLAY_DAO_ABI = require("../artifacts/contracts/PlayDAO.sol/PlayDAO.json");

type MayNumber = ethers.BigNumber | number | string;

export async function createDAO(
  signer: ethers.Signer,
  playDAOAddress: string,
  badgeContractAddress: string,
  name: string,
  metadataURI: string,
  ownerAddress: string
) {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.createDAO(
    name,
    metadataURI,
    badgeContractAddress,
    ownerAddress
  );

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find((e) => e.event === "DAOCreated");

  return daoCreatedEvent.args["daoID"];
}

export async function createBadgeType(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  name: string,
  metadataURI: string
) {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.createBadgeType(daoID, name, metadataURI);

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "BadgeTypeCreated"
  );

  return daoCreatedEvent.args["badgeTypeID"];
}

export async function grantBadge(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  badgeTypeID: MayNumber,
  to: string,
): Promise<void> {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.grantBadge(daoID, badgeTypeID, to);

  const _receipt = await tx.wait();

  return
}

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
) {
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

  return daoCreatedEvent.args["questTypeID"];
}

export async function startQuest(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questTypeID: MayNumber,
  name: string,
  metadataURI: string,
  numContributors: MayNumber,
  requiredStake: number
) {
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

  return daoCreatedEvent.args["questID"];
}

export async function claimQuest(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questID: MayNumber
) {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.claimQuest(daoID, questID);

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "QuestClaimed"
  );

  return daoCreatedEvent.args["claimID"];
}

export async function cancelClaim(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questID: MayNumber,
  claimID: MayNumber
) {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.cancelClaim(daoID, questID, claimID);

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "QuestCanceled"
  );

  return daoCreatedEvent.args["claimID"];
}

export async function completeQuest(
  signer: ethers.Signer,
  playDAOAddress: string,
  daoID: MayNumber,
  questID: MayNumber,
  claimID: MayNumber,
  metadataURI: string,
  score: string
) {
  const PlayDAO = new ethers.Contract(playDAOAddress, PLAY_DAO_ABI.abi, signer);

  const tx = await PlayDAO.completeQuest(
    daoID,
    questID,
    claimID,
    metadataURI,
    score
  );

  const receipt = await tx.wait();

  const daoCreatedEvent = receipt.events.find(
    (e: { event: string }) => e.event === "QuestCompleted"
  );

  return daoCreatedEvent.args["claimID"];
}
