import { Contract } from "ethers";
import { providers, Wallet } from "ethers";
import { ethers } from "hardhat";
import { FileStock, CreatorNFT, RightsNFT } from "../typechain-types";

async function main() {
  const creatorNFTFactory = await ethers.getContractFactory("CreatorNFT");
  const creatorNFTContract = (await creatorNFTFactory.deploy()) as CreatorNFT;
  await creatorNFTContract.deployed();

  const rightsNFTFactory = await ethers.getContractFactory("RightsNFT");
  const rightsNFTContract = (await rightsNFTFactory.deploy()) as RightsNFT;
  await rightsNFTContract.deployed();

  const fileStockFactory = await ethers.getContractFactory("FileStock");
  const filContract = (await fileStockFactory.deploy(
    creatorNFTContract.address,
    rightsNFTContract.address
  )) as FileStock;
  await filContract.deployed();

  await creatorNFTContract.setFileStockAddress(filContract.address);
  await rightsNFTContract.setFileStockAddress(filContract.address);

  console.log("CreatorNFT address:", creatorNFTContract.address);
  console.log("RightsNFT address:", rightsNFTContract.address);
  console.log("FileStock address:", filContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
