import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  console.log("Deploying by", signers[0].address);

  const BadgeFactory = await ethers.getContractFactory("Badge");
  const badge = await BadgeFactory.deploy();
  console.log(`deploying Badge tx: ${badge.deployTransaction.hash}`);
  await badge.deployed();

  const PlayDAOFactory = await ethers.getContractFactory("PlayDAO");
  const playDAO = await PlayDAOFactory.deploy(
    "0x0000000000000000000000000000000000000000"
  );
  console.log(`deploying PlayDAO tx: ${playDAO.deployTransaction.hash}`);
  await playDAO.deployed();

  const tx = await badge.grantMinterRole(playDAO.address);
  console.log(`granting minter role to PlayDAO tx: ${tx.hash}`);
  await tx.wait();

  console.log("");
  console.log("Deployed contracts successfully");
  console.log(`Badge: ${badge.address}`);
  console.log(`PlayDAO: ${playDAO.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
