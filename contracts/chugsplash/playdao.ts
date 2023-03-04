import { UserChugSplashConfig } from "@chugsplash/core";
import hre, { ethers } from "hardhat";

const OPTIMISM_ATTESTATION_STATION =
  "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";

const deployer = new ethers.Wallet(process.env.PRIVATE_KEY!);
const isOptimism = ["optimism", "optimism_goerli"].includes(hre.network.name);

const MINER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("MINER_ROLE")
);

const PUBLISHER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("PUBLISHER_ROLE")
);

const config: UserChugSplashConfig = {
  options: {
    projectName: "PlayDAO",
  },
  contracts: {
    PlayDAO: {
      contract: "PlayDAO",
      variables: {
        _initialized: "0x0",
        _initializing: false,
        _paused: false,
        _owner: deployer.address,
        __gap: [],
        // local fields
        _attestationPublisher: isOptimism
          ? "{{ AttestationPublisher }}"
          : "0x0000000000000000000000000000000000000000",
        _nonce: {
          _value: 0,
        },
        _countDAO: {
          _value: 0,
        },
        _DAOs: {},
        _countQuestType: {},
        _questTypes: {},
        _countQuest: {},
        _quests: {},
        _countClaims: {},
        _claims: {},
        _userToQuestOngoing: {},
        _badgeTypeIDToDAO: {},
        _deposited: {},
        _staked: {},
      },
    },
    Badge: {
      contract: "Badge",
      variables: {
        _initialized: "0x1",
        _initializing: false,
        _roles: {
          [MINER_ROLE]: {
            members: {
              ["{{ PlayDAO }}"]: true,
            },
          },
        },
        __gap: [],
        _balances: {},
        _operatorApprovals: {},
        _uri: "",
        _baseURI: "",
        _tokenURIs: {},
        // local fields
        _badgeIDCounter: {
          _value: 0,
        },
        _badgeNames: {},
      },
    },
    ...(isOptimism
      ? {
          AttestationPublisher: {
            contract: "AttestationPublisher",
            variables: {
              _initialized: true,
              _initializing: false,
              __gap: [],
              _opAttestationStation: OPTIMISM_ATTESTATION_STATION,
              _roles: {
                [PUBLISHER_ROLE]: {
                  members: {
                    ["{{ PlayDAO }}"]: true,
                  },
                },
              },
            },
          },
        }
      : {}),
  },
};

export default config;
