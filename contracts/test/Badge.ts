import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Badge", () => {
  async function deployContracts() {
    const accounts = await ethers.getSigners();

    const Badge = await (
      await ethers.getContractFactory("Badge")
    ).deploy("TestBadge", "TB");

    return { Badge, accounts };
  }

  describe("grantMinterRole", async () => {
    it("should not be able to grant by non-admin", async () => {
      const { Badge, accounts } = await loadFixture(deployContracts);

      expect(
        Badge.connect(accounts[1]).grantMinterRole(accounts[2].address)
      ).to.be.rejectedWith("ERR_ADMIN_ROLE_REQUIRED");
    });

    it("should grant minter role", async () => {
      const { Badge, accounts } = await loadFixture(deployContracts);

      expect(Badge.connect(accounts[0]).grantMinterRole(accounts[1].address))
        .not.to.be.rejected;
    });
  });

  describe("mintBadge", function () {
    it("should throw if account doesn't have minter role", async function () {
      const { Badge, accounts } = await loadFixture(deployContracts);

      expect(
        Badge.connect(accounts[1]).mintBadge(
          accounts[2].address,
          0,
          "",
          0,
          0,
          0
        )
      ).to.be.revertedWith("ERR_MINTER_ROLE_REQUIRED");
    });

    it("should mint a new Badge", async function () {
      const { Badge, accounts } = await loadFixture(deployContracts);

      await expect(Badge.grantMinterRole(accounts[1].address)).not.to.be
        .reverted;

      await expect(
        Badge.connect(accounts[1]).mintBadge(
          accounts[2].address, // owner
          0, // tokenID
          "proof", // proofURI
          1, // daoID
          2, // badgeTypeID
          0 // ActionType
        )
      )
        .to.emit(Badge, "Mint")
        .withArgs(
          accounts[1].address, // issued
          accounts[2].address, // owner
          0, // tokenID
          "proof", // proofURI
          1, // daoID
          2, // badgeTypeID
          0 // ActionType
        );
    });
  });

  describe("transfer", function () {
    it("should be rejected", async function () {
      const { Badge, accounts } = await loadFixture(deployContracts);

      await Badge.grantMinterRole(accounts[1].address);
      await Badge.connect(accounts[1]).mintBadge(
        accounts[2].address,
        0,
        "proof",
        0,
        1,
        2
      );

      await expect(
        Badge.connect(accounts[2]).transferFrom(
          accounts[2].address,
          accounts[0].address,
          0
        )
      ).to.be.reverted;
    });
  });
});
