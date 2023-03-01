import { ethers } from "hardhat";

async function main() {
  const BadgeFactory = await ethers.getContractFactory("Badge");
  const badge = await BadgeFactory.deploy();

  await badge.deployed();

  const PlayDAOFactory = await ethers.getContractFactory("PlayDAO");
  const playDAO = await PlayDAOFactory.deploy();

  await playDAO.deployed();

  console.log("Deployed contracts successfully");
  console.log(`Badge: ${badge.address}`);
  console.log(`PlayDAO: ${playDAO.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
