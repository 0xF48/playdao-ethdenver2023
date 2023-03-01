import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BadgeTypeCreated,
  DAOCreated,
  Deposited,
  OwnershipTransferred,
  Paused,
  QuestCanceled,
  QuestClaimed,
  QuestCompleted,
  QuestStarted,
  QuestTypeCreated,
  Unpaused,
  Withdrew,
  WithdrewFromDAO
} from "../generated/PlayDAO/PlayDAO"

export function createBadgeTypeCreatedEvent(
  daoID: BigInt,
  badgeTypeID: BigInt,
  name: string,
  metadataURI: string
): BadgeTypeCreated {
  let badgeTypeCreatedEvent = changetype<BadgeTypeCreated>(newMockEvent())

  badgeTypeCreatedEvent.parameters = new Array()

  badgeTypeCreatedEvent.parameters.push(
    new ethereum.EventParam("daoID", ethereum.Value.fromUnsignedBigInt(daoID))
  )
  badgeTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "badgeTypeID",
      ethereum.Value.fromUnsignedBigInt(badgeTypeID)
    )
  )
  badgeTypeCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  badgeTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )

  return badgeTypeCreatedEvent
}

export function createDAOCreatedEvent(
  daoID: BigInt,
  name: string,
  metadataURI: string,
  badgeContract: Address,
  owner: Address
): DAOCreated {
  let daoCreatedEvent = changetype<DAOCreated>(newMockEvent())

  daoCreatedEvent.parameters = new Array()

  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("daoID", ethereum.Value.fromUnsignedBigInt(daoID))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "badgeContract",
      ethereum.Value.fromAddress(badgeContract)
    )
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return daoCreatedEvent
}

export function createDepositedEvent(
  account: Address,
  amount: BigInt,
  total: BigInt
): Deposited {
  let depositedEvent = changetype<Deposited>(newMockEvent())

  depositedEvent.parameters = new Array()

  depositedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam("total", ethereum.Value.fromUnsignedBigInt(total))
  )

  return depositedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createQuestCanceledEvent(
  daoID: BigInt,
  questID: BigInt,
  claimID: BigInt,
  operator: Address
): QuestCanceled {
  let questCanceledEvent = changetype<QuestCanceled>(newMockEvent())

  questCanceledEvent.parameters = new Array()

  questCanceledEvent.parameters.push(
    new ethereum.EventParam("daoID", ethereum.Value.fromUnsignedBigInt(daoID))
  )
  questCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "questID",
      ethereum.Value.fromUnsignedBigInt(questID)
    )
  )
  questCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "claimID",
      ethereum.Value.fromUnsignedBigInt(claimID)
    )
  )
  questCanceledEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )

  return questCanceledEvent
}

export function createQuestClaimedEvent(
  daoID: BigInt,
  questTypeID: BigInt,
  questID: BigInt,
  claimID: BigInt,
  claimer: Address
): QuestClaimed {
  let questClaimedEvent = changetype<QuestClaimed>(newMockEvent())

  questClaimedEvent.parameters = new Array()

  questClaimedEvent.parameters.push(
    new ethereum.EventParam("daoID", ethereum.Value.fromUnsignedBigInt(daoID))
  )
  questClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "questTypeID",
      ethereum.Value.fromUnsignedBigInt(questTypeID)
    )
  )
  questClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "questID",
      ethereum.Value.fromUnsignedBigInt(questID)
    )
  )
  questClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "claimID",
      ethereum.Value.fromUnsignedBigInt(claimID)
    )
  )
  questClaimedEvent.parameters.push(
    new ethereum.EventParam("claimer", ethereum.Value.fromAddress(claimer))
  )

  return questClaimedEvent
}

export function createQuestCompletedEvent(
  daoID: BigInt,
  questID: BigInt,
  claimID: BigInt,
  verifier: Address,
  proofMetadataURI: string
): QuestCompleted {
  let questCompletedEvent = changetype<QuestCompleted>(newMockEvent())

  questCompletedEvent.parameters = new Array()

  questCompletedEvent.parameters.push(
    new ethereum.EventParam("daoID", ethereum.Value.fromUnsignedBigInt(daoID))
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "questID",
      ethereum.Value.fromUnsignedBigInt(questID)
    )
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "claimID",
      ethereum.Value.fromUnsignedBigInt(claimID)
    )
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam("verifier", ethereum.Value.fromAddress(verifier))
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "proofMetadataURI",
      ethereum.Value.fromString(proofMetadataURI)
    )
  )

  return questCompletedEvent
}

export function createQuestStartedEvent(
  daoID: BigInt,
  questTypeID: BigInt,
  questID: BigInt,
  name: string,
  metadataURI: string,
  numContributions: BigInt,
  requiredStake: BigInt
): QuestStarted {
  let questStartedEvent = changetype<QuestStarted>(newMockEvent())

  questStartedEvent.parameters = new Array()

  questStartedEvent.parameters.push(
    new ethereum.EventParam("daoID", ethereum.Value.fromUnsignedBigInt(daoID))
  )
  questStartedEvent.parameters.push(
    new ethereum.EventParam(
      "questTypeID",
      ethereum.Value.fromUnsignedBigInt(questTypeID)
    )
  )
  questStartedEvent.parameters.push(
    new ethereum.EventParam(
      "questID",
      ethereum.Value.fromUnsignedBigInt(questID)
    )
  )
  questStartedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  questStartedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )
  questStartedEvent.parameters.push(
    new ethereum.EventParam(
      "numContributions",
      ethereum.Value.fromUnsignedBigInt(numContributions)
    )
  )
  questStartedEvent.parameters.push(
    new ethereum.EventParam(
      "requiredStake",
      ethereum.Value.fromUnsignedBigInt(requiredStake)
    )
  )

  return questStartedEvent
}

export function createQuestTypeCreatedEvent(
  daoID: BigInt,
  questTypeID: BigInt,
  name: string,
  metadataURI: string,
  badgeTypeID: BigInt,
  starterDeps: Array<BigInt>,
  contributorDeps: Array<BigInt>,
  verifierDeps: Array<BigInt>
): QuestTypeCreated {
  let questTypeCreatedEvent = changetype<QuestTypeCreated>(newMockEvent())

  questTypeCreatedEvent.parameters = new Array()

  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam("daoID", ethereum.Value.fromUnsignedBigInt(daoID))
  )
  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "questTypeID",
      ethereum.Value.fromUnsignedBigInt(questTypeID)
    )
  )
  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )
  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "badgeTypeID",
      ethereum.Value.fromUnsignedBigInt(badgeTypeID)
    )
  )
  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "starterDeps",
      ethereum.Value.fromUnsignedBigIntArray(starterDeps)
    )
  )
  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "contributorDeps",
      ethereum.Value.fromUnsignedBigIntArray(contributorDeps)
    )
  )
  questTypeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "verifierDeps",
      ethereum.Value.fromUnsignedBigIntArray(verifierDeps)
    )
  )

  return questTypeCreatedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createWithdrewEvent(
  account: Address,
  amount: BigInt,
  remaining: BigInt
): Withdrew {
  let withdrewEvent = changetype<Withdrew>(newMockEvent())

  withdrewEvent.parameters = new Array()

  withdrewEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  withdrewEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrewEvent.parameters.push(
    new ethereum.EventParam(
      "remaining",
      ethereum.Value.fromUnsignedBigInt(remaining)
    )
  )

  return withdrewEvent
}

export function createWithdrewFromDAOEvent(
  account: Address,
  amount: BigInt,
  remaining: BigInt
): WithdrewFromDAO {
  let withdrewFromDaoEvent = changetype<WithdrewFromDAO>(newMockEvent())

  withdrewFromDaoEvent.parameters = new Array()

  withdrewFromDaoEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  withdrewFromDaoEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrewFromDaoEvent.parameters.push(
    new ethereum.EventParam(
      "remaining",
      ethereum.Value.fromUnsignedBigInt(remaining)
    )
  )

  return withdrewFromDaoEvent
}
