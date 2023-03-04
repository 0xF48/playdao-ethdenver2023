import hre, { ethers, upgrades } from "hardhat";

async function obtainSigner() {
  if (hre.network.name === "truffle_dashboard") {
    // need to obtain network
    await ethers.provider.send("eth_requestAccounts", []);
  }

  const signers = await ethers.getSigners();

  return signers[0];
}

async function main() {
  const isOptimism = ["optimism", "optimism_goerli"].includes(
    hre.network.name!
  );

  const signer = await obtainSigner();
  console.log("Deploying by", signer.address);

  let attestationPublisherAddress =
    "0x0000000000000000000000000000000000000000";

  if (isOptimism) {
    console.log("\nDeploying AttestationPublisher for optimism...");
    const AttestationPublisherFactory = await ethers.getContractFactory(
      "AttestationPublisher"
    );
    const attestationPublisher = await upgrades.deployProxy(
      AttestationPublisherFactory,
      ["0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77"]
    );
    await attestationPublisher.deployed();

    attestationPublisherAddress = attestationPublisher.address;
  }

  console.log("\nDeploying PlayDAO...");
  const PlayDAOFactory = await ethers.getContractFactory("PlayDAO");
  const playDAO = await upgrades.deployProxy(PlayDAOFactory, [
    attestationPublisherAddress,
  ]);

  console.log("\nDeploying Badge...");
  const BadgeFactory = await ethers.getContractFactory("Badge");
  const badge = await upgrades.deployProxy(BadgeFactory, [playDAO.address]);
  await badge.deployed();

  console.log("");
  console.log("Deployed contracts successfully");
  console.log(`Badge: ${badge.address}`);
  console.log(`PlayDAO: ${playDAO.address}`);

  if (isOptimism) {
    console.log(`AttestationPublisher: ${attestationPublisherAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
