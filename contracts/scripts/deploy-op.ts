import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  console.log("Deploying by", signers[0].address);

  const BadgeFactory = await ethers.getContractFactory("Badge");
  const badge = await BadgeFactory.deploy();
  console.log(`deploying Badge tx: ${badge.deployTransaction.hash}`);

  const AttestationPublisherFactory = await ethers.getContractFactory(
    "AttestationPublisher"
  );
  const attestationPublisher = await AttestationPublisherFactory.deploy(
    // Testnet AttestationStation
    "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77"
  );
  console.log(
    `deploying AttestationPublisher tx: ${attestationPublisher.deployTransaction.hash}`
  );
  await attestationPublisher.deployed();

  const PlayDAOFactory = await ethers.getContractFactory("PlayDAO");
  const playDAO = await PlayDAOFactory.deploy(attestationPublisher.address);
  console.log(`deploying PlayDAO tx: ${playDAO.deployTransaction.hash}`);
  await playDAO.deployed();

  const tx1 = await badge.grantMinterRole(playDAO.address);
  console.log(`granting minter role to PlayDAO tx: ${tx1.hash}`);
  await tx1.wait();

  const tx2 = await attestationPublisher.grantPublisherRole(playDAO.address);
  console.log(`granting publisher role to PlayDAO tx: ${tx1.hash}`);
  await tx2.wait();

  console.log("");
  console.log("Deployed contracts successfully");
  console.log(`Badge: ${badge.address}`);
  console.log(`AttestationPublisher: ${attestationPublisher.address}`);
  console.log(`PlayDAO: ${playDAO.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
