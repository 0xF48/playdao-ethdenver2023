import { ethers } from "hardhat";

async function main() {
  const [from, to] = await ethers.getSigners();

  from.sendTransaction({
    to: to.address,
    value: ethers.utils.parseEther("0.01"),
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
