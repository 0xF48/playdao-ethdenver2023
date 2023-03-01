import { Address, BigInt, crypto, log } from "@graphprotocol/graph-ts";
import { Bytes } from "@graphprotocol/graph-ts/common/collections";
import {
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
} from "../generated/schema";

export function handleDAOCreated(event: DAOCreatedEvent): void {
  const daoID = event.params.daoID;
  const dao = new DAO(Bytes.fromBigInt(daoID) as Bytes);

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
    crypto.keccak256(
      Bytes.fromBigInt(event.params.daoID).concat(
        Bytes.fromBigInt(event.params.badgeTypeID)
      )
    ) as Bytes
  );

  badgeType.daoID = event.params.daoID;
  badgeType.badgeTypeID = event.params.badgeTypeID;
  badgeType.name = event.params.name;
  badgeType.metadataURI = event.params.metadataURI;

  badgeType.dao = Bytes.fromBigInt(event.params.daoID) as Bytes;

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
    crypto.keccak256(
      Bytes.fromBigInt(event.params.daoID).concat(
        Bytes.fromBigInt(event.params.questTypeID)
      )
    ) as Bytes
  );

  questType.daoID = event.params.daoID;
  questType.questTypeID = event.params.questTypeID;
  questType.name = event.params.name;
  questType.metadataURI = event.params.metadataURI;
  questType.contributorBadgeTypeID = event.params.contributorBadgeTypeID;
  questType.verifierBadgeTypeID = event.params.verifierBadgeTypeID;

  questType.dao = Bytes.fromBigInt(event.params.daoID) as Bytes;
  questType.contributorBadge = crypto.keccak256(
    Bytes.fromBigInt(event.params.daoID).concat(
      Bytes.fromBigInt(event.params.contributorBadgeTypeID)
    )
  ) as Bytes;

  questType.verifierBadge = crypto.keccak256(
    Bytes.fromBigInt(event.params.daoID).concat(
      Bytes.fromBigInt(event.params.verifierBadgeTypeID)
    )
  ) as Bytes;

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
      crypto.keccak256(
        Bytes.fromBigInt(event.params.daoID).concat(
          Bytes.fromBigInt(event.params.questTypeID).concat(
            Bytes.fromBigInt(depID)
          )
        )
      ) as Bytes
    );

    questTypeStarterDep.questType = questType.id;
    questTypeStarterDep.badgeType = crypto.keccak256(
      Bytes.fromBigInt(event.params.daoID).concat(Bytes.fromBigInt(depID))
    ) as Bytes;

    questTypeStarterDep.save();
  }

  // QuestTypeContributorDep
  for (let i = 0; i < event.params.contributorDeps.length; i++) {
    const depID = event.params.contributorDeps[i];

    const questTypeStarterDep = new QuestTypeContributorDep(
      crypto.keccak256(
        Bytes.fromBigInt(event.params.daoID).concat(
          Bytes.fromBigInt(event.params.questTypeID).concat(
            Bytes.fromBigInt(depID)
          )
        )
      ) as Bytes
    );

    questTypeStarterDep.questType = questType.id;
    questTypeStarterDep.badgeType = crypto.keccak256(
      Bytes.fromBigInt(event.params.daoID).concat(Bytes.fromBigInt(depID))
    ) as Bytes;

    questTypeStarterDep.save();
  }

  // QuestTypeVerifierDep
  for (let i = 0; i < event.params.verifierDeps.length; i++) {
    const depID = event.params.verifierDeps[i];

    const questTypeStarterDep = new QuestTypeVerifierDep(
      crypto.keccak256(
        Bytes.fromBigInt(event.params.daoID).concat(
          Bytes.fromBigInt(event.params.questTypeID).concat(
            Bytes.fromBigInt(depID)
          )
        )
      ) as Bytes
    );

    questTypeStarterDep.questType = questType.id;
    questTypeStarterDep.badgeType = crypto.keccak256(
      Bytes.fromBigInt(event.params.daoID).concat(Bytes.fromBigInt(depID))
    ) as Bytes;

    questTypeStarterDep.save();
  }
}

export function handleQuestStarted(event: QuestStartedEvent): void {
  const quest = new Quest(
    crypto.keccak256(
      Bytes.fromBigInt(event.params.daoID).concat(
        Bytes.fromBigInt(event.params.questTypeID).concat(
          Bytes.fromBigInt(event.params.questID)
        )
      )
    ) as Bytes
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

  quest.dao = Bytes.fromBigInt(event.params.daoID) as Bytes;
  quest.questType = crypto.keccak256(
    Bytes.fromBigInt(event.params.daoID).concat(
      Bytes.fromBigInt(event.params.questTypeID)
    )
  ) as Bytes;

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
    crypto.keccak256(
      Bytes.fromBigInt(event.params.daoID).concat(
        Bytes.fromBigInt(event.params.questID).concat(
          Bytes.fromBigInt(event.params.claimID)
        )
      )
    ) as Bytes
  );

  claim.daoID = event.params.daoID;
  claim.questTypeID = event.params.questTypeID;
  claim.questID = event.params.questID;
  claim.claimID = event.params.claimID;
  claim.claimedBy = event.params.claimer;
  claim.verifiedBy = null;
  claim.status = "ongoing";

  claim.quest = crypto.keccak256(
    Bytes.fromBigInt(event.params.daoID).concat(
      Bytes.fromBigInt(event.params.questTypeID).concat(
        Bytes.fromBigInt(event.params.questID)
      )
    )
  ) as Bytes;

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
  const questHashID = crypto.keccak256(
    Bytes.fromBigInt(daoID).concat(
      Bytes.fromBigInt(questTypeID).concat(Bytes.fromBigInt(questID))
    )
  ) as Bytes;

  const quest = Quest.load(questHashID);
  if (quest == null) {
    log.warning(`Quest not found`, [questHashID.toHex()]);
    return;
  }

  if (quest.requiredStake.equals(BigInt.zero())) {
    return;
  }

  // Update UserDeposit
  let userDeposit = UserDeposit.load(account);
  if (userDeposit == null) {
    log.warning(`UserDeposit not found`, [account.toHex()]);
  } else {
    userDeposit.amount = userDeposit.amount.minus(quest.requiredStake);
    userDeposit.save();
  }

  // Update UserStake
  const userStakeID = crypto.keccak256(Bytes.fromBigInt(daoID).concat(account));
  let userStake = UserStake.load(userStakeID as Bytes);
  if (userStake === null) {
    userStake = new UserStake(userStakeID as Bytes);
    userStake.daoID = daoID;
    userStake.account = account;
  }

  userStake.amount = userStake.amount.plus(quest.requiredStake);
  userStake.save();

  // Update DAO Stake
  const dao = DAO.load(Bytes.fromBigInt(daoID) as Bytes);
  if (dao == null) {
    log.warning(`DAO not found`, [questHashID.toHex()]);
  } else {
    dao.totalStaked = dao.totalStaked.plus(quest.requiredStake);
    dao.save();
  }
}

export function handleQuestCanceled(event: QuestCanceledEvent): void {
  const claimID = crypto.keccak256(
    Bytes.fromBigInt(event.params.daoID).concat(
      Bytes.fromBigInt(event.params.questID).concat(
        Bytes.fromBigInt(event.params.questID)
      )
    )
  ) as Bytes;
  const claim = Claim.load(claimID);

  if (!claim) {
    log.warning(`Claim not found`, [claimID.toHexString()]);

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
  const questHashID = crypto.keccak256(
    Bytes.fromBigInt(daoID).concat(
      Bytes.fromBigInt(questTypeID).concat(Bytes.fromBigInt(questID))
    )
  ) as Bytes;

  const quest = Quest.load(questHashID);
  if (quest == null) {
    log.warning(`Quest not found`, [questHashID.toHex()]);
    return;
  }

  if (quest.requiredStake.equals(BigInt.zero())) {
    return;
  }

  // Update UserStake
  const userStakeID = crypto.keccak256(Bytes.fromBigInt(daoID).concat(account));
  let userStake = UserStake.load(userStakeID as Bytes);
  if (userStake === null) {
    log.warning(`UserStake not found`, [userStakeID.toHex()]);
  } else {
    userStake.amount = userStake.amount.minus(quest.requiredStake);
    userStake.save();
  }

  // Update DAO Stake
  const dao = DAO.load(Bytes.fromBigInt(daoID) as Bytes);
  if (dao == null) {
    log.warning(`DAO not found`, [questHashID.toHex()]);
  } else {
    dao.totalStaked = dao.totalStaked.minus(quest.requiredStake);
    dao.balance = dao.balance.plus(quest.requiredStake);
    dao.save();
  }
}

export function handleQuestCompleted(event: QuestCompletedEvent): void {
  const claimID = crypto.keccak256(
    Bytes.fromBigInt(event.params.daoID).concat(
      Bytes.fromBigInt(event.params.questID).concat(
        Bytes.fromBigInt(event.params.claimID)
      )
    )
  ) as Bytes;
  const claim = Claim.load(claimID);

  if (!claim) {
    log.warning(`Claim not found`, [claimID.toHexString()]);

    return;
  }

  claim.status + "completed";
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
}

function unstake(
  daoID: BigInt,
  questTypeID: BigInt,
  questID: BigInt,
  account: Bytes
): void {
  // Query Quest
  const questHashID = crypto.keccak256(
    Bytes.fromBigInt(daoID).concat(
      Bytes.fromBigInt(questTypeID).concat(Bytes.fromBigInt(questID))
    )
  ) as Bytes;

  const quest = Quest.load(questHashID);
  if (quest == null) {
    log.warning(`Quest not found`, [questHashID.toHex()]);
    return;
  }

  if (quest.requiredStake.equals(BigInt.zero())) {
    return;
  }

  // Update UserDeposit
  let userDeposit = UserDeposit.load(account);
  if (userDeposit == null) {
    log.warning(`UserDeposit not found`, [account.toHex()]);
  } else {
    userDeposit.amount = userDeposit.amount.plus(quest.requiredStake);
    userDeposit.save();
  }

  // Update UserStake
  const userStakeID = crypto.keccak256(
    Bytes.fromBigInt(daoID).concat(account) as Bytes
  );
  let userStake = UserStake.load(userStakeID as Bytes);
  if (userStake === null) {
    log.warning(`UserStake not found`, [userStakeID.toHex()]);
  } else {
    userStake.amount = userStake.amount.minus(quest.requiredStake);
    userStake.save();
  }

  // Update DAO Stake
  const dao = DAO.load(Bytes.fromBigInt(daoID) as Bytes);
  if (dao == null) {
    log.warning(`DAO not found`, [questHashID.toHex()]);
  } else {
    dao.totalStaked = dao.totalStaked.minus(quest.requiredStake);
    dao.save();
  }
}

export function handleDeposited(event: DepositedEvent): void {
  let userDeposit = UserDeposit.load(event.params.account);
  if (userDeposit == null) {
    userDeposit = new UserDeposit(event.params.account);
    userDeposit.account = event.params.account;
  }

  userDeposit.amount = event.params.total;

  userDeposit.save();
}

export function handleWithdrew(event: WithdrewEvent): void {
  let userDeposit = UserDeposit.load(event.params.account);
  if (userDeposit == null) {
    log.warning(`UserDeposit not found`, [event.params.account.toHex()]);

    return;
  }

  userDeposit.amount = event.params.remaining;

  userDeposit.save();
}

export function handleWithdrewFromDAO(event: WithdrewFromDAOEvent): void {
  const dao = DAO.load(Bytes.fromBigInt(event.params.daoID) as Bytes);
  if (dao == null) {
    log.warning(`DAO not found`, [event.params.daoID.toHex()]);
  } else {
    dao.balance = event.params.remaining;
  }
}
