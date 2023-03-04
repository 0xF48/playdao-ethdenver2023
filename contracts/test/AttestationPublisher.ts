import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { keccak256 } from "ethers/lib/utils";

describe("AttestationPublisher", () => {
  async function deployContracts() {
    const accounts = await ethers.getSigners();
    const MockAttestationStation = await (
      await ethers.getContractFactory("MockAttestationStation")
    ).deploy();

    const AttestationPublisher = await upgrades.deployProxy(
      await ethers.getContractFactory("AttestationPublisher"),
      [MockAttestationStation.address]
    );

    return { AttestationPublisher, MockAttestationStation, accounts };
  }

  describe("grantPublisherRole", () => {
    it("reject if it's called from non-admin account", async () => {
      const { AttestationPublisher, accounts } = await loadFixture(
        deployContracts
      );

      await expect(
        AttestationPublisher.connect(accounts[1]).grantPublisherRole(
          accounts[2].address
        )
      ).to.revertedWith("ERR_ADMIN_ROLE_REQUIRED");
    });

    it("should grant publisher role", async () => {
      const { AttestationPublisher, accounts } = await loadFixture(
        deployContracts
      );

      await expect(AttestationPublisher.grantPublisherRole(accounts[1].address))
        .to.emit(AttestationPublisher, "RoleGranted")
        .withArgs(
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PUBLISHER_ROLE")),
          accounts[1].address,
          accounts[0].address
        );
    });
  });

  describe("publishGrantedAttestation", () => {
    it("should reject when calling from non publisher account", async () => {
      const { AttestationPublisher, accounts } = await loadFixture(
        deployContracts
      );

      await expect(
        AttestationPublisher.connect(accounts[1]).publishGrantedAttestation(
          ethers.utils.formatBytes32String("hello"),
          accounts[1].address,
          accounts[0].address,
          0,
          0,
          0
        )
      ).to.rejectedWith("ERR_PUBLISHER_ROLE_REQUIRED");
    });

    it("should post attestation", async () => {
      const { AttestationPublisher, MockAttestationStation, accounts } =
        await loadFixture(deployContracts);

      const key = ethers.utils.toUtf8Bytes("hello");
      const expectedKey =
        ethers.utils.hexlify(key) + "0".repeat((32 - key.length) * 2);

      await expect(
        AttestationPublisher.publishGrantedAttestation(
          key,
          accounts[1].address,
          accounts[0].address,
          0,
          1,
          2
        )
      ).to.emit(MockAttestationStation, "AttestationCreated");

      const rawAttestations = await MockAttestationStation.getAttestation(
        accounts[1].address,
        expectedKey
      );
      const attestations = JSON.parse(
        ethers.utils.toUtf8String(rawAttestations)
      );

      expect(attestations).to.eql({
        type: "grant",
        issued_by: accounts[0].address.toString().toLowerCase(),
        requested_by: accounts[0].address.toString().toLowerCase(),
        nonce: 0,
        dao: 1,
        badge: 2,
      });
    });
  });

  describe("publishContrbutedAttestation", () => {
    it("should reject when calling from non publisher account", async () => {
      const { AttestationPublisher, accounts } = await loadFixture(
        deployContracts
      );

      await expect(
        AttestationPublisher.connect(accounts[1]).publishContrbutedAttestation({
          rawKey: ethers.utils.formatBytes32String("hello"),
          to: accounts[1].address,
          verifier: accounts[0].address,
          score: "good",
          nonce: 0,
          daoID: 0,
          badgeTypeID: 0,
          questTypeID: 0,
          questID: 0,
          claimID: 0,
        })
      ).to.rejectedWith("ERR_PUBLISHER_ROLE_REQUIRED");
    });

    it("should post attestation", async () => {
      const { AttestationPublisher, MockAttestationStation, accounts } =
        await loadFixture(deployContracts);

      const key = ethers.utils.toUtf8Bytes("hello");
      const expectedKey =
        ethers.utils.hexlify(key) + "0".repeat((32 - key.length) * 2);

      await expect(
        AttestationPublisher.publishContrbutedAttestation({
          rawKey: key,
          to: accounts[1].address,
          verifier: accounts[0].address,
          score: "good",
          nonce: 0,
          daoID: 1,
          badgeTypeID: 2,
          questTypeID: 3,
          questID: 4,
          claimID: 5,
        })
      ).to.emit(MockAttestationStation, "AttestationCreated");

      const rawAttestations = await MockAttestationStation.getAttestation(
        accounts[1].address,
        expectedKey
      );
      const attestations = JSON.parse(
        ethers.utils.toUtf8String(rawAttestations)
      );

      expect(attestations).to.eql({
        type: "contributed",
        issued_by: accounts[0].address.toString().toLowerCase(),
        verified_by: accounts[0].address.toString().toLowerCase(),
        score: "good",
        nonce: 0,
        dao: 1,
        badge: 2,
        quest_type: 3,
        quest: 4,
        claim: 5,
      });
    });
  });

  describe("publishVerifiedAttestation", () => {
    it("should reject when calling from non publisher account", async () => {
      const { AttestationPublisher, accounts } = await loadFixture(
        deployContracts
      );

      await expect(
        AttestationPublisher.connect(accounts[1]).publishVerifiedAttestation({
          rawKey: ethers.utils.formatBytes32String("hello"),
          to: accounts[1].address,
          contributor: accounts[0].address,
          score: "good",
          nonce: 0,
          daoID: 0,
          badgeTypeID: 0,
          questTypeID: 0,
          questID: 0,
          claimID: 0,
        })
      ).to.rejectedWith("ERR_PUBLISHER_ROLE_REQUIRED");
    });

    it("should post to attestation station", async () => {
      const { AttestationPublisher, MockAttestationStation, accounts } =
        await loadFixture(deployContracts);

      const key = ethers.utils.toUtf8Bytes("hello");
      const expectedKey =
        ethers.utils.hexlify(key) + "0".repeat((32 - key.length) * 2);

      await expect(
        AttestationPublisher.publishVerifiedAttestation({
          rawKey: key,
          to: accounts[1].address,
          contributor: accounts[0].address,
          score: "great",
          nonce: 1,
          daoID: 2,
          badgeTypeID: 3,
          questTypeID: 4,
          questID: 5,
          claimID: 6,
        })
      ).to.emit(MockAttestationStation, "AttestationCreated");

      const rawAttestations = await MockAttestationStation.getAttestation(
        accounts[1].address,
        expectedKey
      );
      const attestations = JSON.parse(
        ethers.utils.toUtf8String(rawAttestations)
      );

      expect(attestations).to.eql({
        type: "verified",
        issued_by: accounts[0].address.toString().toLowerCase(),
        verified_to: accounts[0].address.toString().toLowerCase(),
        score: "great",
        nonce: 1,
        dao: 2,
        badge: 3,
        quest_type: 4,
        quest: 5,
        claim: 6,
      });
    });
  });
});
