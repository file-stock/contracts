import { Contract } from 'ethers';
import { providers, Wallet } from 'ethers';
import { ethers } from "hardhat";
import { FileStock } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {

  const fileStockFactory = await ethers.getContractFactory("FileStock");
  const fileStockContract = await fileStockFactory.deploy() as FileStock;
  await fileStockContract.deployed();

  const accounts = await ethers.getSigners();
  
  const rightsId = await fileStockContract.connect(accounts[0]).storeFile("06b3dfaec148fb1bb2b" , 100);
  console.log(rightsId);
  // const balanceBNBefore = await accounts[0].getBalance();
  // const balanceBefore = await ethers.utils.formatEther(balanceBNBefore);

  // await fileStockContract.connect(accounts[0]).buyFile(rightsId);
  // const balanceBNAfter = await accounts[0].getBalance();
  // const balanceAfter = await ethers.utils.formatEther(balanceBNAfter);
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




