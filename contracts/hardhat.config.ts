import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

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
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
      ],
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

export default config;
