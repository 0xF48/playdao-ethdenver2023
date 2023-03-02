import { Address, BigInt, crypto, log } from "@graphprotocol/graph-ts";
import { Bytes } from "@graphprotocol/graph-ts/common/collections";
import {
  BadgeGranted as BadgeGrantedEvent,
  BadgeTypeCreated as BadgeTypeCreatedEvent,
  DAOCreated as DAOCreatedEvent,
  Deposited as DepositedEvent,
  QuestCanceled as QuestCanceledEvent,
  QuestClaimed as QuestClaimedEvent,
  QuestCompleted as QuestCompletedEvent,
  QuestStarted as QuestStartedEvent,
  QuestTypeCreated as QuestTypeCreatedEvent,
  Withdrew as WithdrewEvent,
  WithdrewFromDAO as WithdrewFromDAOEvent,
} from "../generated/PlayDAO/PlayDAO";
import {
  BadgeType,
  QuestType,
  DAO,
  QuestTypeStarterDep,
  QuestTypeContributorDep,
  QuestTypeVerifierDep,
  Quest,
  Claim,
  UserDeposit,
  UserStake,
  BadgeIssueHistory,
} from "../generated/schema";

export function handleDAOCreated(event: DAOCreatedEvent): void {
  const dao = new DAO(event.params.daoID.toHex());

  dao.daoID = event.params.daoID;
  dao.name = event.params.name;
  dao.metadataURI = event.params.metadataURI;
  dao.badgeContract = event.params.badgeContract;
  dao.totalStaked = BigInt.zero();
  dao.balance = BigInt.zero();

  dao.createdBy = event.transaction.from;
  dao.createdBlock = event.block.number;
  dao.createdBlockHash = event.block.hash;
  dao.createdTimestamp = event.block.timestamp;
  dao.createdTransactionHash = event.transaction.hash;

  dao.save();
}

export function handleBadgeTypeCreated(event: BadgeTypeCreatedEvent): void {
  const badgeType = new BadgeType(
    `${event.params.daoID.toHex()}_${event.params.badgeTypeID.toHex()}`
  );

  badgeType.daoID = event.params.daoID;
  badgeType.badgeTypeID = event.params.badgeTypeID;
  badgeType.name = event.params.name;
  badgeType.metadataURI = event.params.metadataURI;

  badgeType.dao = event.params.daoID.toHex();

  badgeType.createdBy = event.transaction.from;
  badgeType.createdBlock = event.block.number;
  badgeType.createdBlockHash = event.block.hash;
  badgeType.createdTimestamp = event.block.timestamp;
  badgeType.createdTransactionHash = event.transaction.hash;

  badgeType.save();
}

export function handleQuestTypeCreated(event: QuestTypeCreatedEvent): void {
  // QuestType
  const questType = new QuestType(
    `${event.params.daoID.toHex()}_${event.params.questTypeID.toHex()}`
  );

  questType.daoID = event.params.daoID;
  questType.questTypeID = event.params.questTypeID;
  questType.name = event.params.name;
  questType.metadataURI = event.params.metadataURI;
  questType.contributorBadgeTypeID = event.params.contributorBadgeTypeID;
  questType.verifierBadgeTypeID = event.params.verifierBadgeTypeID;

  questType.dao = event.params.daoID.toHex();
  questType.contributorBadge = `${event.params.daoID.toHex()}_${event.params.contributorBadgeTypeID.toHex()}`;
  questType.verifierBadge = `${event.params.daoID.toHex()}_${event.params.verifierBadgeTypeID.toHex()}`;

  questType.createdBy = event.transaction.from;
  questType.createdBlock = event.block.number;
  questType.createdBlockHash = event.block.hash;
  questType.createdTimestamp = event.block.timestamp;
  questType.createdTransactionHash = event.transaction.hash;

  questType.save();

  // QuestTypeStarterDep
  for (let i = 0; i < event.params.starterDeps.length; i++) {
    const depID = event.params.starterDeps[i];

    const questTypeStarterDep = new QuestTypeStarterDep(
      `${event.params.daoID.toHex()}_${event.params.questTypeID.toHex()}_${depID.toHex()}`
    );

    questTypeStarterDep.questType = questType.id;
    questTypeStarterDep.badgeType = `${event.params.daoID.toHex()}_${depID.toHex()}`;

    questTypeStarterDep.save();
  }

  // QuestTypeContributorDep
  for (let i = 0; i < event.params.contributorDeps.length; i++) {
    const depID = event.params.contributorDeps[i];

    const questTypeStarterDep = new QuestTypeContributorDep(
      `${event.params.daoID.toHex()}_${event.params.questTypeID.toHex()}_${depID.toHex()}`
    );

    questTypeStarterDep.questType = questType.id;
    questTypeStarterDep.badgeType = `${event.params.daoID.toHex()}_${depID.toHex()}`;

    questTypeStarterDep.save();
  }

  // QuestTypeVerifierDep
  for (let i = 0; i < event.params.verifierDeps.length; i++) {
    const depID = event.params.verifierDeps[i];

    const questTypeStarterDep = new QuestTypeVerifierDep(
      `${event.params.daoID.toHex()}_${event.params.questTypeID.toHex()}_${depID.toHex()}`
    );

    questTypeStarterDep.questType = questType.id;
    questTypeStarterDep.badgeType = `${event.params.daoID.toHex()}_${depID.toHex()}`;

    questTypeStarterDep.save();
  }
}

export function handleQuestStarted(event: QuestStartedEvent): void {
  const quest = new Quest(
    `${event.params.daoID.toHex()}_${event.params.questTypeID.toHex()}_${event.params.questID.toHex()}`
  );

  quest.daoID = event.params.daoID;
  quest.questTypeID = event.params.questTypeID;
  quest.questID = event.params.questID;
  quest.name = event.params.name;
  quest.metadataURI = event.params.metadataURI;
  quest.limitContributions = event.params.numContributions;
  quest.numOnGoings = BigInt.zero();
  quest.numCompleted = BigInt.zero();
  quest.numCanceled = BigInt.zero();
  quest.requiredStake = event.params.requiredStake;

  quest.dao = event.params.daoID.toHex();
  quest.questType = `${event.params.daoID.toHex()}_${event.params.questTypeID.toHex()}`;

  quest.createdBy = event.transaction.from;
  quest.createdBlock = event.block.number;
  quest.createdBlockHash = event.block.hash;
  quest.createdTimestamp = event.block.timestamp;
  quest.createdTransactionHash = event.transaction.hash;

  quest.save();
}

export function handleQuestClaimed(event: QuestClaimedEvent): void {
  // Claim
  const claim = new Claim(
    `${event.params.daoID.toHex()}_${event.params.questID.toHex()}_${event.params.claimID.toHex()}`
  );

  claim.daoID = event.params.daoID;
  claim.questTypeID = event.params.questTypeID;
  claim.questID = event.params.questID;
  claim.claimID = event.params.claimID;
  claim.status = "ongoing";

  claim.claimedBy = event.params.claimer;
  claim.claimedBlock = event.block.number;
  claim.claimedBlockHash = event.block.hash;
  claim.claimedTimestamp = event.block.timestamp;
  claim.claimedTransactionHash = event.transaction.hash;

  claim.quest = `${event.params.daoID.toHex()}_${event.params.questTypeID.toHex()}_${event.params.questID.toHex()}`;

  claim.createdBy = event.transaction.from;
  claim.createdBlock = event.block.number;
  claim.createdBlockHash = event.block.hash;
  claim.createdTimestamp = event.block.timestamp;
  claim.createdTransactionHash = event.transaction.hash;

  claim.updatedBy = event.transaction.from;
  claim.updatedBlock = event.block.number;
  claim.updatedBlockHash = event.block.hash;
  claim.updatedTimestamp = event.block.timestamp;
  claim.updatedTransactionHash = event.transaction.hash;

  claim.save();

  // UserStake
  stake(
    event.params.daoID,
    event.params.questTypeID,
    event.params.questID,
    event.params.claimer
  );
}

function stake(
  daoID: BigInt,
  questTypeID: BigInt,
  questID: BigInt,
  account: Address
): void {
  // Query Quest
  const questIdentifer = `${daoID.toHex()}_${questTypeID.toHex()}_${questID.toHex()}`;
  const quest = Quest.load(questIdentifer);
  if (quest == null) {
    log.warning(`Quest not found`, [questIdentifer]);
    return;
  }

  if (quest.requiredStake.equals(BigInt.zero())) {
    return;
  }

  // Update UserDeposit
  let userDeposit = UserDeposit.load(account.toHex());
  if (userDeposit == null) {
    log.warning(`UserDeposit not found`, [account.toHex()]);
  } else {
    userDeposit.account = account;
    // TODO: fix
    userDeposit.amount = userDeposit.amount.minus(quest.requiredStake);
    userDeposit.save();
  }

  // Update UserStake
  const userStakeID = `${daoID.toHex()}_${account.toHex()}`;
  let userStake = UserStake.load(userStakeID);
  if (userStake === null) {
    userStake = new UserStake(userStakeID);
    userStake.daoID = daoID;
    userStake.account = account;
    userStake.dao = daoID.toHex();
    userStake.amount = BigInt.zero();
  }

  userStake.amount = userStake.amount.plus(quest.requiredStake);
  userStake.save();

  // Update DAO Stake
  const dao = DAO.load(daoID.toHex());
  if (dao == null) {
    log.warning(`DAO not found`, [daoID.toHex()]);
  } else {
    dao.totalStaked = dao.totalStaked.plus(quest.requiredStake);
    dao.save();
  }
}

export function handleQuestCanceled(event: QuestCanceledEvent): void {
  const claimID = `${event.params.daoID.toHex()}_${event.params.questID.toHex()}_${event.params.claimID.toHex()}`;
  const claim = Claim.load(claimID);

  if (!claim) {
    log.warning(`Claim not found`, [claimID]);

    return;
  }

  claim.status + "canceled";
  claim.canceledBlock = event.block.number;
  claim.canceledBlockHash = event.block.hash;
  claim.canceledTimestamp = event.block.timestamp;
  claim.canceledTransactionHash = event.transaction.hash;

  claim.updatedBy = event.transaction.from;
  claim.updatedBlock = event.block.number;
  claim.updatedBlockHash = event.block.hash;
  claim.updatedTimestamp = event.block.timestamp;
  claim.updatedTransactionHash = event.transaction.hash;

  claim.save();

  slash(event.params.daoID, claim.questTypeID, claim.questID, claim.claimedBy);
}

function slash(
  daoID: BigInt,
  questTypeID: BigInt,
  questID: BigInt,
  account: Bytes
): void {
  // Query Quest
  const questIdentifier = `${daoID.toHex()}_${questTypeID.toHex()}_${questID.toHex()}`;

  const quest = Quest.load(questIdentifier);
  if (quest == null) {
    log.warning(`Quest not found`, [questIdentifier]);
    return;
  }

  if (quest.requiredStake.equals(BigInt.zero())) {
    return;
  }

  // Update UserStake
  const userStakeID = `${daoID.toHex()}_${account.toHex()}`;
  let userStake = UserStake.load(userStakeID);
  if (userStake === null) {
    log.warning(`UserStake not found`, [userStakeID]);
  } else {
    userStake.amount = userStake.amount.minus(quest.requiredStake);
    userStake.save();
  }

  // Update DAO Stake
  const dao = DAO.load(daoID.toHex());
  if (dao == null) {
    log.warning(`DAO not found`, [daoID.toHex()]);
  } else {
    dao.totalStaked = dao.totalStaked.minus(quest.requiredStake);
    dao.balance = dao.balance.plus(quest.requiredStake);
    dao.save();
  }
}

export function handleQuestCompleted(event: QuestCompletedEvent): void {
  const claimID = `${event.params.daoID.toHex()}_${event.params.questID.toHex()}_${event.params.claimID.toHex()}`;
  const claim = Claim.load(claimID);

  if (!claim) {
    log.warning(`Claim not found`, [claimID]);

    return;
  }

  claim.status = "completed";
  claim.verifiedBy = event.transaction.from;
  claim.proofMetadataURI = event.params.proofMetadataURI;

  claim.completedBlock = event.block.number;
  claim.completedBlockHash = event.block.hash;
  claim.completedTimestamp = event.block.timestamp;
  claim.completedTransactionHash = event.transaction.hash;

  claim.updatedBy = event.transaction.from;
  claim.updatedBlock = event.block.number;
  claim.updatedBlockHash = event.block.hash;
  claim.updatedTimestamp = event.block.timestamp;
  claim.updatedTransactionHash = event.transaction.hash;

  claim.save();

  unstake(claim.daoID, claim.questTypeID, claim.questID, claim.claimedBy);

  createBadgeIssueHistory(
    claim.daoID,
    Address.fromBytes(claim.claimedBy),
    event.params.verifier,
    "contributed",
    event.params.contributorBadgeKey,
    event.transaction.hash,
    event.block.number,
    event.block.hash,
    event.block.timestamp,
    event.transaction.hash,
    claim.questID,
    claim.questTypeID,
    claim.claimID
  );

  createBadgeIssueHistory(
    claim.daoID,
    event.params.verifier,
    event.params.verifier,
    "verified",
    event.params.verifierBadgeKey,
    event.transaction.hash,
    event.block.number,
    event.block.hash,
    event.block.timestamp,
    event.transaction.hash,
    claim.questID,
    claim.questTypeID,
    claim.claimID
  );
}

function unstake(
  daoID: BigInt,
  questTypeID: BigInt,
  questID: BigInt,
  account: Bytes
): void {
  // Query Quest
  const questHashIdentifier = `${daoID.toHex()}_${questTypeID.toHex()}_${questID.toHex()}`;

  const quest = Quest.load(questHashIdentifier);
  if (quest == null) {
    log.warning(`Quest not found`, [questHashIdentifier]);
    return;
  }

  if (quest.requiredStake.equals(BigInt.zero())) {
    return;
  }

  // Update UserDeposit
  let userDeposit = UserDeposit.load(account.toHex());
  if (userDeposit == null) {
    log.warning(`UserDeposit not found`, [account.toHex()]);
  } else {
    userDeposit.amount = userDeposit.amount.plus(quest.requiredStake);
    userDeposit.save();
  }

  // Update UserStake
  const userStakeID = `${daoID.toHex()}_${account.toHex()}`;
  let userStake = UserStake.load(userStakeID);
  if (userStake === null) {
    log.warning(`UserStake not found`, [userStakeID]);
  } else {
    userStake.amount = userStake.amount.minus(quest.requiredStake);
    userStake.save();
  }

  // Update DAO Stake
  const dao = DAO.load(daoID.toHex());
  if (dao == null) {
    log.warning(`DAO not found`, [daoID.toHex()]);
  } else {
    dao.totalStaked = dao.totalStaked.minus(quest.requiredStake);
    dao.save();
  }
}

function createBadgeIssueHistory(
  daoID: BigInt,
  account: Address,
  requested: Address,
  type: string,
  hashKey: Bytes,
  txHash: Bytes,
  createdBlock: BigInt,
  createdBlockHash: Bytes,
  createdTimestamp: BigInt,
  createdTransactionHash: Bytes,
  questID: BigInt | null = null,
  questTypeID: BigInt | null = null,
  claimID: BigInt | null = null
): void {
  const badge = new BadgeIssueHistory(
    `${daoID.toHex()}_${account.toHex()}_${type}_${txHash.toHex()}`
  );

  badge.account = account;
  badge.daoID = daoID;
  badge.dao = daoID.toHex();
  badge.type = type;
  badge.requested = requested;
  badge.hashKey = hashKey;

  badge.createdBlock = createdBlock;
  badge.createdBlockHash = createdBlockHash;
  badge.createdTimestamp = createdTimestamp;
  badge.createdTransactionHash = createdTransactionHash;

  if (questID && questTypeID) {
    badge.questID = questID;
    badge.quest = `${daoID.toHex()}_${questTypeID.toHex()}_${questID.toHex()}`;
  }

  if (questID && claimID) {
    badge.claimID = claimID;
    badge.claim = `${daoID.toHex()}_${questID.toHex()}_${claimID.toHex()}`;
  }

  badge.save();
}

export function handleBadgeGranted(event: BadgeGrantedEvent): void {
  createBadgeIssueHistory(
    event.params.daoID,
    event.params.to,
    event.params.from,
    "granted",
    event.params.hashKey,
    event.transaction.hash,
    event.block.number,
    event.block.hash,
    event.block.timestamp,
    event.transaction.hash
  );
}

export function handleDeposited(event: DepositedEvent): void {
  let userDeposit = UserDeposit.load(event.params.account.toHex());
  if (userDeposit == null) {
    userDeposit = new UserDeposit(event.params.account.toHex());
    userDeposit.account = event.params.account;
  }

  userDeposit.amount = event.params.total;

  userDeposit.save();
}

export function handleWithdrew(event: WithdrewEvent): void {
  let userDeposit = UserDeposit.load(event.params.account.toHex());
  if (userDeposit == null) {
    log.warning(`UserDeposit not found`, [event.params.account.toHex()]);

    return;
  }

  userDeposit.amount = event.params.remaining;

  userDeposit.save();
}

export function handleWithdrewFromDAO(event: WithdrewFromDAOEvent): void {
  const dao = DAO.load(event.params.daoID.toHex());
  if (dao == null) {
    log.warning(`DAO not found`, [event.params.daoID.toHex()]);
  } else {
    dao.balance = event.params.remaining;
  }
}
