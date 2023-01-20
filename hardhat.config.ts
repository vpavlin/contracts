import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer"
import "hardhat-deploy";

dotenv.config();


const config: HardhatUserConfig = {
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
    mumbai: {
      url: "https://matic-testnet-archive-rpc.bwarelabs.com",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      forking: {
        url: process.env.NODE_URI !== undefined ? process.env.NODE_URI : "",
        //blockNumber: 16708100
      }
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.CMC_KEY,
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
    token: "MATIC"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  contractSizer: {
    runOnCompile: true,
    strict: true,
  },
};

export default config;
