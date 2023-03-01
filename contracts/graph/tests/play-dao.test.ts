import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { BadgeTypeCreated } from "../generated/schema"
import { BadgeTypeCreated as BadgeTypeCreatedEvent } from "../generated/PlayDAO/PlayDAO"
import { handleBadgeTypeCreated } from "../src/play-dao"
import { createBadgeTypeCreatedEvent } from "./play-dao-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let daoID = BigInt.fromI32(234)
    let badgeTypeID = BigInt.fromI32(234)
    let name = "Example string value"
    let metadataURI = "Example string value"
    let newBadgeTypeCreatedEvent = createBadgeTypeCreatedEvent(
      daoID,
      badgeTypeID,
      name,
      metadataURI
    )
    handleBadgeTypeCreated(newBadgeTypeCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BadgeTypeCreated created and stored", () => {
    assert.entityCount("BadgeTypeCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BadgeTypeCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "daoID",
      "234"
    )
    assert.fieldEquals(
      "BadgeTypeCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "badgeTypeID",
      "234"
    )
    assert.fieldEquals(
      "BadgeTypeCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "BadgeTypeCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadataURI",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
