import { ethers } from "hardhat";

async function main() {
  const BadgeFactory = await ethers.getContractFactory("Badge");
  const badge = await BadgeFactory.deploy();

  await badge.deployed();

  await (await badge.createNewBadgeType("hello", "hoge")).wait();
  await (await badge.mintBadge("0xD979df5BF656D45318D84670aF00a00e0a5e5A0c", 1, ethers.utils.formatBytes32String("hello"))).wait();
  await (await badge.mintBadge("0xF1A70483a23207b17264Df0331EDda10c5c28c28", 1, ethers.utils.formatBytes32String("hello"))).wait();

  console.log("Badge:", badge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
