import { ethers } from "hardhat";

async function main() {
  const PlayDAOFactory = await ethers.getContractFactory("PlayDAO");
  const playDAO = await PlayDAOFactory.deploy();

  await playDAO.deployed();

  console.log(`Deployed PlayDAO address=${playDAO.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
