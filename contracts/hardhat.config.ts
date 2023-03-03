import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

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
    },
  },
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [
      ]
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
  },
};

export default config;
