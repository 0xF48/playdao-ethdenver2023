import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("PlayDAO", () => {
  async function deployContracts() {
    const accounts = await ethers.getSigners();
    const Badge = await (
      await ethers.getContractFactory("Badge")
    ).deploy("TestBadge", "TB");

    const PlayDAO = await (await ethers.getContractFactory("PlayDAO")).deploy();

    await Badge.grantMinterRole(PlayDAO.address);

    return {
      Badge,
      PlayDAO,
      accounts,
      daoName: "DAO_NAME",
      daoMetadataURI: "DAO_METADATA_URI",
      badgeTypeName: "BADGE_TYPE_NAME",
      badgeTypeMetadataURI: "BADGE_TYPE_METADATA_URI",
      questTypeName: "QUEST_TYPE_NAME",
      questTypeMetadataURI: "QUEST_TYPE_METADATA_URI",
      questName: "QUEST_NAME",
      questMetadataURI: "QUEST_METADATA_URI",
      proofMetadataURI: "PROOF_METADATA_URI",
    };
  }

  describe("Initial Value", function () {
    it("should not be paused", async function () {
      const { PlayDAO } = await loadFixture(deployContracts);

      expect(await PlayDAO.paused()).to.false;
    });

    it("totalDAOs should return zero", async function () {
      const { PlayDAO } = await loadFixture(deployContracts);

      expect(await PlayDAO.totalDAOs()).to.eq(0);
    });

    it("totalBadgeTypes should return zero", async function () {
      const { PlayDAO } = await loadFixture(deployContracts);

      expect(await PlayDAO.totalBadgeTypes(0)).to.eq(0);
    });

    it("totalQuestTypes should return zero", async function () {
      const { PlayDAO } = await loadFixture(deployContracts);

      expect(await PlayDAO.totalQuestTypes(0)).to.eq(0);
    });

    it("totalQuests should return zero", async function () {
      const { PlayDAO } = await loadFixture(deployContracts);

      expect(await PlayDAO.totalQuests(0)).to.eq(0);
    });

    it("totalClaims should return zero", async function () {
      const { PlayDAO } = await loadFixture(deployContracts);

      expect(await PlayDAO.totalClaims(0, 0)).to.eq(0);
    });

    it("totalStaked should return zero", async function () {
      const { PlayDAO } = await loadFixture(deployContracts);

      expect(await PlayDAO.totalStaked(0)).to.eq(0);
    });
  });

  describe("deposit", () => {
    const amount = ethers.utils.parseEther("1.5");

    it("should be rejected when paused", async () => {
      const { PlayDAO } = await loadFixture(deployContracts);

      await PlayDAO.pause();

      await expect(PlayDAO.deposit({ value: amount })).to.be.revertedWith(
        "Pausable: paused"
      );
    });

    it("should deposit user's asset", async () => {
      const { PlayDAO, accounts } = await loadFixture(deployContracts);

      await expect(PlayDAO.deposit({ value: amount }))
        .to.emit(PlayDAO, "Deposited")
        .withArgs(accounts[0].address, amount, amount)
        .and.changeEtherBalances(
          [accounts[0].address, PlayDAO.address],
          [amount.mul(-1), amount]
        );
    });

    it("should track the total of user's deposit", async () => {
      const { PlayDAO, accounts } = await loadFixture(deployContracts);

      const amount1 = ethers.utils.parseEther("1.5");
      const amount2 = ethers.utils.parseEther("1.0");
      const total = amount1.add(amount2);

      await expect(PlayDAO.deposit({ value: amount1 })).not.to.be.reverted;

      await expect(PlayDAO.deposit({ value: amount2 }))
        .to.emit(PlayDAO, "Deposited")
        .withArgs(accounts[0].address, amount, total)
        .and.changeEtherBalances(
          [accounts[0].address, PlayDAO.address],
          [amount2.mul(-1), amount2]
        );
    });
  });

  describe("withdraw", () => {
    it("should reject if the amount exceeds the total user's deposit", async () => {
      const { PlayDAO } = await loadFixture(deployContracts);

      const deposit = ethers.utils.parseEther("1.0");
      const withdraw = ethers.utils.parseEther("1.5");

      await expect(PlayDAO.deposit({ value: deposit })).not.to.be.reverted;

      await expect(PlayDAO.withdraw(withdraw)).to.be.reverted;
    });

    it("should withdraw the specified amount", async () => {
      const { PlayDAO, accounts } = await loadFixture(deployContracts);

      const deposit = ethers.utils.parseEther("1.0");
      const withdraw = ethers.utils.parseEther("0.4");

      await expect(PlayDAO.deposit({ value: deposit })).not.to.be.reverted;

      await expect(PlayDAO.withdraw(withdraw))
        .to.emit(PlayDAO, "Withdrew")
        .withArgs(accounts[0].address, withdraw, deposit.sub(withdraw))
        .and.changeEtherBalances(
          [accounts[0].address, PlayDAO.address],
          [withdraw, withdraw.mul(-1)]
        );
    });
  });

  describe("createDAO", () => {
    it("should reject when being paused", async () => {
      const { PlayDAO, Badge, accounts, daoName, daoMetadataURI } =
        await loadFixture(deployContracts);

      await PlayDAO.pause();

      await expect(
        PlayDAO.createDAO(
          daoName,
          daoMetadataURI,
          Badge.address,
          accounts[0].address
        )
      ).to.be.rejectedWith("Pausable: paused");
    });

    it("should reject if DAO name is empty", async () => {
      const { PlayDAO, Badge, accounts, daoMetadataURI } = await loadFixture(
        deployContracts
      );

      await expect(
        PlayDAO.createDAO(
          "",
          daoMetadataURI,
          Badge.address,
          accounts[0].address
        )
      ).to.be.rejectedWith("ERR_EMPTY_DAO_NAME");
    });

    it("should reject if DAO contentURI is empty", async () => {
      const { PlayDAO, Badge, accounts, daoName } = await loadFixture(
        deployContracts
      );

      await expect(
        PlayDAO.createDAO(daoName, "", Badge.address, accounts[0].address)
      ).to.be.rejectedWith("ERR_EMPTY_DAO_METADATA_URI");
    });

    it("should reject if badge contract address is zero", async () => {
      const { PlayDAO, accounts, daoName, daoMetadataURI } = await loadFixture(
        deployContracts
      );

      await expect(
        PlayDAO.createDAO(
          daoName,
          daoMetadataURI,
          ZERO_ADDRESS,
          accounts[0].address
        )
      ).to.be.rejectedWith("ERR_EMPTY_DAO_BADGE_CONTRACT");
    });

    it("should reject if DAO onwer address is zero", async () => {
      const { PlayDAO, Badge, daoName, daoMetadataURI } = await loadFixture(
        deployContracts
      );

      await expect(
        PlayDAO.createDAO(daoName, daoMetadataURI, Badge.address, ZERO_ADDRESS)
      ).to.be.rejectedWith("ERR_EMPTY_DAO_OWNER");
    });

    it("should create a DAO", async () => {
      const { PlayDAO, Badge, accounts, daoName, daoMetadataURI } =
        await loadFixture(deployContracts);

      await expect(
        PlayDAO.createDAO(
          daoName,
          daoMetadataURI,
          Badge.address,
          accounts[0].address
        )
      )
        .to.emit(PlayDAO, "DAOCreated")
        .withArgs(
          0,
          daoName,
          daoMetadataURI,
          Badge.address,
          accounts[0].address
        );

      expect(await PlayDAO.totalDAOs()).to.eq(1);
    });
  });

  describe("createBadgeType", () => {
    it("should reject if paused", async () => {
      const {
        PlayDAO,
        Badge,
        accounts,
        daoName,
        daoMetadataURI,
        badgeTypeName,
        badgeTypeMetadataURI,
      } = await loadFixture(deployContracts);

      await PlayDAO.createDAO(
        daoName,
        daoMetadataURI,
        Badge.address,
        accounts[0].address
      );

      await PlayDAO.pause();

      await expect(
        PlayDAO.createBadgeType(0, badgeTypeName, badgeTypeMetadataURI)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should reject if DAO doesn't exist", async () => {
      const { PlayDAO, badgeTypeName, badgeTypeMetadataURI } =
        await loadFixture(deployContracts);

      await expect(
        PlayDAO.createBadgeType(0, badgeTypeName, badgeTypeMetadataURI)
      ).to.be.revertedWith("ERR_DAO_NOT_FOUND");
    });

    it("should reject if called from non-DAO owner", async () => {
      const {
        PlayDAO,
        Badge,
        accounts,
        daoName,
        daoMetadataURI,
        badgeTypeName,
        badgeTypeMetadataURI,
      } = await loadFixture(deployContracts);

      await PlayDAO.createDAO(
        daoName,
        daoMetadataURI,
        Badge.address,
        accounts[0].address
      );

      await expect(
        PlayDAO.connect(accounts[1]).createBadgeType(
          0,
          badgeTypeName,
          badgeTypeMetadataURI
        )
      ).to.be.revertedWith("ERR_NOT_DAO_OWNER");
    });

    it("should reject if called from non-DAO owner", async () => {
      const {
        PlayDAO,
        Badge,
        accounts,
        daoName,
        daoMetadataURI,
        badgeTypeName,
        badgeTypeMetadataURI,
      } = await loadFixture(deployContracts);

      await PlayDAO.createDAO(
        daoName,
        daoMetadataURI,
        Badge.address,
        accounts[0].address
      );

      await expect(
        PlayDAO.createBadgeType(0, badgeTypeName, badgeTypeMetadataURI)
      )
        .to.emit(PlayDAO, "BadgeTypeCreated")
        .withArgs(0, 0, badgeTypeName, badgeTypeMetadataURI);

      expect(await PlayDAO.totalBadgeTypes(0)).to.eq(1);
    });
  });

  describe("createBadgeType", () => {
    async function setup() {
      const res = await loadFixture(deployContracts);

      await res.PlayDAO.createDAO(
        res.daoName,
        res.daoMetadataURI,
        res.Badge.address,
        res.accounts[0].address
      );

      await res.PlayDAO.createBadgeType(
        0,
        res.badgeTypeName,
        res.badgeTypeMetadataURI
      );

      return {
        ...res,
        daoID: 0,
        badgeTypeID: 0,
      };
    }

    it("should reject if paused", async () => {
      const {
        PlayDAO,
        daoID,
        badgeTypeID,
        questTypeName,
        questTypeMetadataURI,
      } = await loadFixture(setup);

      await PlayDAO.pause();

      await expect(
        PlayDAO.createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should reject if DAO doesn't exist", async () => {
      const { PlayDAO, badgeTypeID, questTypeName, questTypeMetadataURI } =
        await loadFixture(setup);

      await expect(
        PlayDAO.createQuestType(
          1,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        )
      ).to.be.revertedWith("ERR_DAO_NOT_FOUND");
    });

    it("should reject when being called from non-DAO owner", async () => {
      const {
        PlayDAO,
        accounts,
        daoID,
        badgeTypeID,
        questTypeName,
        questTypeMetadataURI,
      } = await loadFixture(setup);

      await expect(
        PlayDAO.connect(accounts[1]).createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        )
      ).to.be.revertedWith("ERR_NOT_DAO_OWNER");
    });

    it("should reject if questTypeName is empty", async () => {
      const { PlayDAO, daoID, badgeTypeID, questTypeMetadataURI } =
        await loadFixture(setup);

      await expect(
        PlayDAO.createQuestType(
          daoID,
          "",
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        )
      ).to.be.revertedWith("ERR_EMPTY_QUEST_TYPE_NAME");
    });

    it("should reject if questTypeMetadataURI is empty", async () => {
      const { PlayDAO, daoID, badgeTypeID, questTypeName } = await loadFixture(
        setup
      );

      await expect(
        PlayDAO.createQuestType(
          daoID,
          questTypeName,
          "",
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        )
      ).to.be.revertedWith("ERR_EMPTY_QUEST_TYPE_METADATA_URI");
    });

    it("should reject if badgeType does not exist", async () => {
      const {
        PlayDAO,
        daoID,
        badgeTypeID,
        questTypeName,
        questTypeMetadataURI,
      } = await loadFixture(setup);

      await expect(
        PlayDAO.createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          5,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        )
      ).to.be.revertedWith("ERR_BADGE_TYPE_NOT_FOUND");
    });

    it("should reject if some of starterDeps does not exist", async () => {
      const {
        PlayDAO,
        daoID,
        badgeTypeID,
        questTypeName,
        questTypeMetadataURI,
      } = await loadFixture(setup);

      await expect(
        PlayDAO.createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [0, 1, 2],
          [badgeTypeID],
          [badgeTypeID]
        )
      ).to.be.revertedWith("ERR_BADGE_TYPE_NOT_FOUND");
    });

    it("should reject if some of contributorDeps does not exist", async () => {
      const {
        PlayDAO,
        daoID,
        badgeTypeID,
        questTypeName,
        questTypeMetadataURI,
      } = await loadFixture(setup);

      await expect(
        PlayDAO.createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [0, 1, 2],
          [badgeTypeID]
        )
      ).to.be.revertedWith("ERR_BADGE_TYPE_NOT_FOUND");
    });

    it("should reject if some of verifierDeps does not exist", async () => {
      const {
        PlayDAO,
        daoID,
        badgeTypeID,
        questTypeName,
        questTypeMetadataURI,
      } = await loadFixture(setup);

      await expect(
        PlayDAO.createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [0, 1, 2]
        )
      ).to.be.revertedWith("ERR_BADGE_TYPE_NOT_FOUND");
    });

    it("should create a quest type", async () => {
      const {
        PlayDAO,
        daoID,
        badgeTypeID,
        questTypeName,
        questTypeMetadataURI,
      } = await loadFixture(setup);

      await expect(
        PlayDAO.createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        )
      )
        .to.emit(PlayDAO, "QuestTypeCreated")
        .withArgs(
          daoID,
          0,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [badgeTypeID],
          [badgeTypeID],
          [badgeTypeID]
        );

      expect(await PlayDAO.totalQuestTypes(daoID)).to.eq(1);
    });
  });

  describe("startQuest", () => {
    async function setup() {
      const res = await loadFixture(deployContracts);

      await res.PlayDAO.createDAO(
        res.daoName,
        res.daoMetadataURI,
        res.Badge.address,
        res.accounts[0].address
      );

      await res.PlayDAO.createBadgeType(
        0,
        res.badgeTypeName,
        res.badgeTypeMetadataURI
      );

      await res.PlayDAO.createQuestType(
        0,
        res.questTypeName,
        res.questTypeMetadataURI,
        0,
        [],
        [],
        []
      );

      return {
        ...res,
        daoID: 0,
        badgeTypeID: 0,
        questTypeID: 0,
      };
    }

    it("should reject if paused", async () => {
      const { PlayDAO, daoID, questTypeID, questName, questMetadataURI } =
        await loadFixture(setup);

      await PlayDAO.pause();

      await expect(
        PlayDAO.startQuest(
          daoID,
          questTypeID,
          questName,
          questMetadataURI,
          1,
          0
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should reject if DAO doesn't exist", async () => {
      const { PlayDAO, questTypeID, questName, questMetadataURI } =
        await loadFixture(setup);

      await expect(
        PlayDAO.startQuest(5, questTypeID, questName, questMetadataURI, 1, 0)
      ).to.be.revertedWith("ERR_DAO_NOT_FOUND");
    });

    it("should reject if DAO doesn't exist", async () => {
      const { PlayDAO, daoID, questName, questMetadataURI } = await loadFixture(
        setup
      );

      await expect(
        PlayDAO.startQuest(daoID, 2, questName, questMetadataURI, 1, 0)
      ).to.be.revertedWith("ERR_QUEST_TYPE_NOT_FOUND");
    });

    it("should reject if num contribution is zero", async () => {
      const { PlayDAO, daoID, questTypeID, questName, questMetadataURI } =
        await loadFixture(setup);

      await expect(
        PlayDAO.startQuest(
          daoID,
          questTypeID,
          questName,
          questMetadataURI,
          0,
          0
        )
      ).to.be.revertedWith("ERR_ZERO_NUM_CONTRIBUTIONS");
    });

    it("should reject if the account doesn't have starters deps badges ", async () => {
      const {
        PlayDAO,
        daoID,
        questTypeName,
        questTypeMetadataURI,
        questName,
        questMetadataURI,
      } = await loadFixture(setup);

      await PlayDAO.createQuestType(
        0,
        questTypeName,
        questTypeMetadataURI,
        0,
        [0],
        [],
        []
      );

      await expect(
        PlayDAO.startQuest(daoID, 1, questName, questMetadataURI, 1, 0)
      ).to.be.revertedWith("ERR_START_QUEST_NOT_ALLOWED");
    });

    it("should start a quest", async () => {
      const { PlayDAO, daoID, questTypeID, questName, questMetadataURI } =
        await loadFixture(setup);
      const numContributions = 5;
      const requiredStake = ethers.utils.parseEther("1.5");

      await expect(
        PlayDAO.startQuest(
          daoID,
          questTypeID,
          questName,
          questMetadataURI,
          numContributions,
          requiredStake
        )
      )
        .to.emit(PlayDAO, "QuestStarted")
        .withArgs(
          daoID,
          questTypeID,
          0,
          questName,
          questMetadataURI,
          numContributions,
          requiredStake
        );

      expect(await PlayDAO.totalQuests(daoID)).to.eq(1);
    });
  });

  describe("claimQuest", () => {
    async function setup() {
      const res = await loadFixture(deployContracts);

      await res.PlayDAO.createDAO(
        res.daoName,
        res.daoMetadataURI,
        res.Badge.address,
        res.accounts[0].address
      );

      await res.PlayDAO.createBadgeType(
        0,
        res.badgeTypeName,
        res.badgeTypeMetadataURI
      );

      await res.PlayDAO.createQuestType(
        0,
        res.questTypeName,
        res.questTypeMetadataURI,
        0,
        [],
        [],
        []
      );

      await res.PlayDAO.startQuest(
        0,
        0,
        res.questName,
        res.questMetadataURI,
        1,
        0
      );

      return {
        ...res,
        daoID: 0,
        badgeTypeID: 0,
        questTypeID: 0,
        questID: 0,
      };
    }

    it("should reject if paused", async () => {
      const { PlayDAO, daoID, questID } = await loadFixture(setup);

      await PlayDAO.pause();

      await expect(PlayDAO.claimQuest(daoID, questID)).to.be.revertedWith(
        "Pausable: paused"
      );
    });

    it("should reject if DAO doesn't exist", async () => {
      const { PlayDAO, questID } = await loadFixture(setup);

      await expect(PlayDAO.claimQuest(1, questID)).to.be.revertedWith(
        "ERR_DAO_NOT_FOUND"
      );
    });

    it("should reject if quest doesn't exist", async () => {
      const { PlayDAO, daoID } = await loadFixture(setup);

      await expect(PlayDAO.claimQuest(daoID, 1)).to.be.revertedWith(
        "ERR_QUEST_NOT_FOUND"
      );
    });

    it("should reject if quest doesn't exist", async () => {
      const {
        PlayDAO,
        daoID,
        questTypeName,
        questTypeMetadataURI,
        questName,
        questMetadataURI,
      } = await loadFixture(setup);

      PlayDAO.createBadgeType(0, "hoge", "fuga");

      await PlayDAO.createQuestType(
        0,
        questTypeName,
        questTypeMetadataURI,
        0,
        [],
        // claim deps
        [0, 1],
        []
      );

      await PlayDAO.startQuest(0, 1, questName, questMetadataURI, 1, 0);

      await expect(PlayDAO.claimQuest(daoID, 1)).to.be.revertedWith(
        "ERR_CLAIM_NOT_ALLOWED"
      );
    });

    it("should revert if user has not deposited enough", async () => {
      const { PlayDAO, daoID, questTypeID, questName, questMetadataURI } =
        await loadFixture(setup);

      const deposit = ethers.utils.parseEther("0.9");
      const requiredStake = ethers.utils.parseEther("1.5");

      await PlayDAO.deposit({ value: deposit });

      await PlayDAO.startQuest(
        daoID,
        questTypeID,
        questName,
        questMetadataURI,
        1,
        requiredStake
      );

      await expect(PlayDAO.claimQuest(daoID, 1)).to.be.revertedWith(
        "ERR_INSUFFICIENT_STAKE"
      );
    });

    it("should revert when exceeding limitContributions", async () => {
      const { PlayDAO, daoID, questID, accounts } = await loadFixture(setup);

      await expect(PlayDAO.claimQuest(daoID, questID)).not.to.be.reverted;

      await expect(
        PlayDAO.connect(accounts[1]).claimQuest(daoID, questID)
      ).to.be.revertedWith("ERR_NO_MORE_CLAIM");
    });

    it("should revert if claimed twice by same account", async () => {
      const { PlayDAO, daoID, questID } = await loadFixture(setup);

      await expect(PlayDAO.claimQuest(daoID, questID)).not.to.be.reverted;

      await expect(PlayDAO.claimQuest(daoID, questID)).to.be.revertedWith(
        "ERR_QUEST_CLAIMED_ALREADY"
      );
    });

    it("should create a new claim", async () => {
      const { PlayDAO, daoID, questTypeID, questID, accounts } =
        await loadFixture(setup);

      await expect(PlayDAO.claimQuest(daoID, questID))
        .to.emit(PlayDAO, "QuestClaimed")
        .withArgs(daoID, questTypeID, questID, 0, accounts[0].address);

      expect(await PlayDAO.totalClaims(0, 0)).to.eq(1);
    });

    it("should deposit when claiming", async () => {
      const {
        PlayDAO,
        daoID,
        questTypeID,
        accounts,
        questName,
        questMetadataURI,
      } = await loadFixture(setup);

      const beforeDeposit = ethers.utils.parseEther("0.9");
      const newDeposit = ethers.utils.parseEther("0.6");
      const requiredStake = ethers.utils.parseEther("1.5");

      await PlayDAO.deposit({ value: beforeDeposit });

      await PlayDAO.startQuest(
        daoID,
        questTypeID,
        questName,
        questMetadataURI,
        1,
        requiredStake
      );

      await expect(
        PlayDAO.claimQuest(daoID, 1, { value: newDeposit })
      ).changeEtherBalances(
        [accounts[0].address, PlayDAO.address],
        [newDeposit.mul(-1), newDeposit]
      );

      expect(await PlayDAO.totalStaked(daoID)).to.eq(
        beforeDeposit.add(newDeposit)
      );
    });
  });

  describe("cancelClaim", () => {
    async function setup() {
      const res = await loadFixture(deployContracts);

      await res.PlayDAO.createDAO(
        res.daoName,
        res.daoMetadataURI,
        res.Badge.address,
        res.accounts[0].address
      );

      await res.PlayDAO.createBadgeType(
        0,
        res.badgeTypeName,
        res.badgeTypeMetadataURI
      );

      await res.PlayDAO.createQuestType(
        0,
        res.questTypeName,
        res.questTypeMetadataURI,
        0,
        [],
        [],
        []
      );

      await res.PlayDAO.startQuest(
        0,
        0,
        res.questName,
        res.questMetadataURI,
        1,
        0
      );

      await res.PlayDAO.claimQuest(0, 0);

      return {
        ...res,
        daoID: 0,
        badgeTypeID: 0,
        questTypeID: 0,
        questID: 0,
        claimID: 0,
      };
    }

    it("should reject if paused", async () => {
      const { PlayDAO, daoID, questID, claimID } = await loadFixture(setup);

      await PlayDAO.pause();

      await expect(
        PlayDAO.cancelClaim(daoID, questID, claimID)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should reject if DAO doesn't exist", async () => {
      const { PlayDAO, questID, claimID } = await loadFixture(setup);

      await expect(PlayDAO.cancelClaim(1, questID, claimID)).to.be.revertedWith(
        "ERR_DAO_NOT_FOUND"
      );
    });

    it("should reject if quest doesn't exist", async () => {
      const { PlayDAO, daoID, claimID } = await loadFixture(setup);

      await expect(PlayDAO.cancelClaim(daoID, 1, claimID)).to.be.revertedWith(
        "ERR_QUEST_NOT_FOUND"
      );
    });

    it("should reject if claim doesn't exist", async () => {
      const { PlayDAO, daoID, questID } = await loadFixture(setup);

      await expect(PlayDAO.cancelClaim(daoID, questID, 1)).to.be.revertedWith(
        "ERR_CLAIM_NOT_FOUND"
      );
    });

    it("should reject if account is not claimer nor verifier", async () => {
      const {
        accounts,
        PlayDAO,
        daoID,
        questTypeName,
        questTypeMetadataURI,
        questName,
        questMetadataURI,
      } = await loadFixture(setup);

      await PlayDAO.createQuestType(
        daoID,
        questTypeName,
        questTypeMetadataURI,
        0,
        [],
        [],
        [0]
      );

      await PlayDAO.startQuest(daoID, 1, questName, questMetadataURI, 1, 0);

      await PlayDAO.claimQuest(daoID, 1);

      await expect(
        PlayDAO.connect(accounts[1]).cancelClaim(daoID, 1, 0)
      ).to.be.revertedWith("ERR_CANCEL_CLAIM_NOT_ALLOWED");
    });

    it("should cancel claim with slash", async () => {
      const {
        accounts,
        PlayDAO,
        daoID,
        questTypeName,
        questTypeMetadataURI,
        questName,
        questMetadataURI,
      } = await loadFixture(setup);

      await PlayDAO.createQuestType(
        daoID,
        questTypeName,
        questTypeMetadataURI,
        0,
        [],
        [],
        []
      );

      const requiredStake = ethers.utils.parseEther("1.5");
      const deposit = ethers.utils.parseEther("2.0");

      await PlayDAO.startQuest(
        daoID,
        1,
        questName,
        questMetadataURI,
        1,
        requiredStake
      );

      await PlayDAO.deposit({ value: deposit });

      await PlayDAO.claimQuest(daoID, 1);

      expect(await PlayDAO.totalStaked(daoID)).to.eq(requiredStake);
      expect(await PlayDAO.balanceOf(daoID)).to.eq(0);
      expect(await PlayDAO.depositedOf(accounts[0].address)).to.eq(
        deposit.sub(requiredStake)
      );

      await expect(PlayDAO.cancelClaim(daoID, 1, 0))
        .to.emit(PlayDAO, "QuestCanceled")
        .withArgs(daoID, 1, 0, accounts[0].address);

      expect(await PlayDAO.totalStaked(daoID)).to.eq(0);
      expect(await PlayDAO.balanceOf(daoID)).to.eq(requiredStake); // slashed
      expect(await PlayDAO.depositedOf(accounts[0].address)).to.eq(
        deposit.sub(requiredStake) // keep amount
      );
    });

    describe("completeQuest", () => {
      async function setup() {
        const res = await loadFixture(deployContracts);

        await res.PlayDAO.createDAO(
          res.daoName,
          res.daoMetadataURI,
          res.Badge.address,
          res.accounts[0].address
        );

        await res.PlayDAO.createBadgeType(
          0,
          res.badgeTypeName,
          res.badgeTypeMetadataURI
        );

        await res.PlayDAO.createQuestType(
          0,
          res.questTypeName,
          res.questTypeMetadataURI,
          0,
          [],
          [],
          []
        );

        await res.PlayDAO.startQuest(
          0,
          0,
          res.questName,
          res.questMetadataURI,
          1,
          0
        );

        await res.PlayDAO.claimQuest(0, 0);

        return {
          ...res,
          daoID: 0,
          badgeTypeID: 0,
          questTypeID: 0,
          questID: 0,
          claimID: 0,
        };
      }

      it("should reject if paused", async () => {
        const { PlayDAO, daoID, questID, claimID, accounts, proofMetadataURI } =
          await loadFixture(setup);

        await PlayDAO.pause();

        await expect(
          PlayDAO.connect(accounts[1]).completeQuest(
            daoID,
            questID,
            claimID,
            proofMetadataURI
          )
        ).to.be.revertedWith("Pausable: paused");
      });

      it("should reject if DAO doesn't exist", async () => {
        const { PlayDAO, questID, claimID, accounts, proofMetadataURI } =
          await loadFixture(setup);

        await expect(
          PlayDAO.connect(accounts[1]).completeQuest(
            1,
            questID,
            claimID,
            proofMetadataURI
          )
        ).to.be.revertedWith("ERR_DAO_NOT_FOUND");
      });

      it("should reject if quest doesn't exist", async () => {
        const { PlayDAO, daoID, claimID, accounts, proofMetadataURI } =
          await loadFixture(setup);

        await expect(
          PlayDAO.connect(accounts[1]).completeQuest(
            daoID,
            1,
            claimID,
            proofMetadataURI
          )
        ).to.be.revertedWith("ERR_QUEST_NOT_FOUND");
      });

      it("should reject if claim doesn't exist", async () => {
        const { PlayDAO, daoID, questID, accounts, proofMetadataURI } =
          await loadFixture(setup);

        await expect(
          PlayDAO.connect(accounts[1]).completeQuest(
            daoID,
            questID,
            1,
            proofMetadataURI
          )
        ).to.be.revertedWith("ERR_CLAIM_NOT_FOUND");
      });

      it("should reject if verifier is itself", async () => {
        const { PlayDAO, daoID, questID, claimID, proofMetadataURI } =
          await loadFixture(setup);

        await expect(
          PlayDAO.completeQuest(daoID, questID, claimID, proofMetadataURI)
        ).to.be.revertedWith("ERR_SELF_VERIFICATION");
      });

      it("should reject if verifier doesn't have required badge to verify", async () => {
        const {
          PlayDAO,
          daoID,
          proofMetadataURI,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          questName,
          questMetadataURI,
          accounts,
        } = await loadFixture(setup);

        await PlayDAO.createQuestType(
          daoID,
          questTypeName,
          questTypeMetadataURI,
          badgeTypeID,
          [],
          [],
          [badgeTypeID]
        );

        await PlayDAO.startQuest(daoID, 1, questName, questMetadataURI, 1, 0);

        await PlayDAO.claimQuest(daoID, 1);

        await expect(
          PlayDAO.connect(accounts[1]).completeQuest(
            daoID,
            1,
            0,
            proofMetadataURI
          )
        ).to.be.revertedWith("ERR_VERIFY_CLAIM_NOT_ALLOWED");
      });

      it("should complete quest", async () => {
        const {
          accounts,
          Badge,
          PlayDAO,
          daoID,
          proofMetadataURI,
          badgeTypeID,
          questName,
          questMetadataURI,
        } = await loadFixture(setup);

        const requiredStake = ethers.utils.parseEther("1.5");
        const deposit = ethers.utils.parseEther("2.0");

        await PlayDAO.startQuest(
          daoID,
          0,
          questName,
          questMetadataURI,
          1,
          requiredStake
        );

        await PlayDAO.claimQuest(daoID, 1, { value: deposit });

        expect(await PlayDAO.totalStaked(daoID)).to.eq(requiredStake);
        expect(await PlayDAO.balanceOf(daoID)).to.eq(0);
        expect(await PlayDAO.depositedOf(accounts[0].address)).to.eq(
          deposit.sub(requiredStake)
        );

        await expect(
          PlayDAO.connect(accounts[1]).completeQuest(
            daoID,
            1,
            0,
            proofMetadataURI
          )
        )
          .to.emit(PlayDAO, "QuestCompleted")
          .withArgs(daoID, 1, 0, accounts[1].address, proofMetadataURI)
          .and.to.emit(Badge, "Mint")
          .withArgs(
            PlayDAO.address, // issuer
            accounts[0].address, // owner
            ethers.utils.keccak256(
              ethers.utils.solidityPack(
                [
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint8",
                  "address",
                ],
                [daoID, badgeTypeID, 0, 1, 0, 0, accounts[0].address]
              )
            ),
            proofMetadataURI,
            daoID,
            badgeTypeID,
            0 // contributor
          )
          .and.to.emit(Badge, "Mint")
          .withArgs(
            PlayDAO.address, // issuer
            accounts[1].address, // owner
            ethers.utils.keccak256(
              ethers.utils.solidityPack(
                [
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint8",
                  "address",
                ],
                [daoID, badgeTypeID, 0, 1, 0, 1, accounts[1].address]
              )
            ),
            proofMetadataURI,
            daoID,
            badgeTypeID,
            1 // contributor
          );

        // fill-refund
        expect(await PlayDAO.totalStaked(daoID)).to.eq(0);
        expect(await PlayDAO.balanceOf(daoID)).to.eq(0);
        expect(await PlayDAO.depositedOf(accounts[0].address)).to.eq(deposit);
      });
    });
  });

  describe("e2e", () => {
    it("", async () => {});
  });
});
