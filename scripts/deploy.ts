import { Contract } from 'ethers';
import { providers, Wallet } from 'ethers';
import { ethers } from "hardhat";
import { FileStock } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new providers.JsonRpcProvider(`https://testnet.hyperspace.io/`);
  const privateKey : string|any = process.env.PRIVATE_KEY;
  let fileStock : FileStock;

  // Load the private key of the deployer's wallet
  const wallet = new Wallet(privateKey, provider);
  // console.log(wallet)

  // const fileStockFactory = await ethers.getContractFactory("FileStock");
  // fileStock = await fileStockFactory.deploy(provider) as FileStock; // Hyperspace test net address
  // fileStock.deployed()
  // console.log(`FileStock contract was deployed at address: ${fileStock.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




