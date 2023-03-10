import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

require("dotenv").config();
require("@chugsplash/plugins");

const PRIVATE_KEYS = process.env.PRIVATE_KEYS
  ? process.env.PRIVATE_KEYS.split(",")
  : [];
const JSON_RPC_ETHEREUM_MAINNET = process.env.JSON_RPC_ETHEREUM_MAINNET ?? "";
const JSON_RPC_ETHEREUM_GOERLI = process.env.JSON_RPC_ETHEREUM_GOERLI ?? "";
const JSON_RPC_POLYGON_MAINNET =
  process.env.JSON_RPC_POLYGON_MAINNET ?? "https://polygon-rpc.com/";
const JSON_RPC_POLYGON_MUMBAI =
  process.env.JSON_RPC_POLYGON_MUMBAI ?? "https://rpc-mumbai.maticvigil.com/";
const JSON_RPC_OPTIMISM_GOERLI = process.env.JSON_RPC_OPTIMISM_GOERLI ?? "";

const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY!;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
    customChains: [
      {
        network: "optimism_goerli",
        chainId: 420,
        urls: {
          apiURL: "https://api-goerli-optimism.etherscan.io/api",
          browserURL: "https://goerli-optimism.etherscan.io",
        },
      },
      {
        network: "base_testnet",
        chainId: 84531,
        urls: {
          apiURL: "https://goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
    ],
  },
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [],
    },
    goerli: {
      url: JSON_RPC_ETHEREUM_GOERLI,
      accounts: PRIVATE_KEYS,
    },
    polygon: {
      url: JSON_RPC_POLYGON_MAINNET,
      accounts: PRIVATE_KEYS,
    },
    mumbai: {
      url: JSON_RPC_POLYGON_MUMBAI,
      accounts: PRIVATE_KEYS,
    },
    base_testnet: {
      url: "https://goerli.base.org",
      accounts: PRIVATE_KEYS,
    },
    optimism_goerli: {
      url: JSON_RPC_OPTIMISM_GOERLI,
      accounts: PRIVATE_KEYS,
    },
    scroll_testnet: {
      url: "https://alpha-rpc.scroll.io/l2",
      accounts: PRIVATE_KEYS,
    },
    neon_dev: {
      url: "https://devnet.neonevm.org",
      accounts: PRIVATE_KEYS,
    },
    truffle_dashboard: {
      url: "http://localhost:24012/rpc",
    },
  },
};

task("convert_file", "Convert a file")
  .addParam("path", "File Path")
  .setAction(async (args, hre) => {
    const filePath = args.path;

    const ext = path.extname(filePath).substr(1);
    const isImage = ["gif", "jpg", "jpeg", "png"].includes(ext);
    console.log("isImage", isImage);

    const data = isImage
      ? `data:image/${ext};base64,${fs.readFileSync(filePath, "base64")}`
      : fs.readFileSync(filePath);

    const filename =
      path.basename(args.path).split(".")[0] +
      "_" +
      ethers.utils
        .keccak256([
          // filename
          ...ethers.utils.toUtf8Bytes(path.basename(args.path)),
          // timestamp
          ...ethers.utils.toUtf8Bytes(new Date().getTime().toString()),
        ])
        .slice(0, 12);

    const tmpFilePath = `${filename}.${ext}`;
    fs.writeFileSync(tmpFilePath, data);

    console.log("converted", tmpFilePath);
  });

export default config;
