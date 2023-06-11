import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    // hardhat: {
    //   forking: {
    //     url: process.env.MUMBAI_URL || "",
    //   },
    //   // blockGasLimit: 20000000,
    //   // gas: 12000000,
    //   // allowUnlimitedContractSize: true,
    // },
    calibration: {
      url: process.env.CALIBRATION_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
