import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const PRIVATE_KEYS = process.env.PRIVATE_KEYS
  ? process.env.PRIVATE_KEYS.split(",")
  : [];
const JSON_RPC_ETHEREUM_MAINNET = process.env.JSON_RPC_ETHEREUM_MAINNET!;
const JSON_RPC_ETHEREUM_GOERLI = process.env.JSON_RPC_ETHEREUM_GOERLI!;
const JSON_RPC_POLYGON_MAINNET =
  process.env.JSON_RPC_POLYGON_MAINNET ?? "https://polygon-rpc.com/";
const JSON_RPC_POLYGON_MUMBAI =
  process.env.JSON_RPC_POLYGON_MUMBAI ?? "https://rpc-mumbai.maticvigil.com/";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
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
  },
};

export default config;
