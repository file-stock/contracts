import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, providers } from "ethers";
import { ethers, network } from "hardhat";
import { FileStock, CreatorNFT, RightsNFT } from "../typechain-types";

const AMOUNT_SUPPLY = 1000n * 10n ** 18n; // 1000 FIL
const tags = [2, 4];

describe("Store and buy file", function () {
  let accounts: SignerWithAddress[];
  let filContract: Contract;
  let creatorNFTContract: Contract;
  let rightsNFTContract: Contract;

  this.beforeEach(async () => {
    accounts = await ethers.getSigners();

    const creatorNFTFactory = await ethers.getContractFactory("CreatorNFT");
    creatorNFTContract = (await creatorNFTFactory.deploy()) as CreatorNFT;
    await creatorNFTContract.deployed();

    const rightsNFTFactory = await ethers.getContractFactory("RightsNFT");
    rightsNFTContract = (await rightsNFTFactory.deploy()) as RightsNFT;
    await rightsNFTContract.deployed();

    const fileStockFactory = await ethers.getContractFactory("FileStock");
    filContract = (await fileStockFactory.deploy(
      creatorNFTContract.address,
      rightsNFTContract.address
    )) as FileStock;
    await filContract.deployed();

    await creatorNFTContract
      .connect(accounts[0])
      .setFileStockAddress(filContract.address);
    await rightsNFTContract
      .connect(accounts[0])
      .setFileStockAddress(filContract.address);
  });

  it("Should buy file", async () => {
    const priceBN = ethers.utils.parseEther("100");
    await filContract.connect(accounts[0]).storeFile("cidValue", priceBN, tags);
    const balanceBNBefore = await accounts[1].getBalance();
    const balanceBefore = await ethers.utils.formatEther(balanceBNBefore);
    await filContract.connect(accounts[1]).buyFile(1, { value: priceBN });
    const balanceBNAfter = await accounts[1].getBalance();
    const balanceAfter = await ethers.utils.formatEther(balanceBNAfter);
    expect(Number(balanceBefore.toString())).to.be.greaterThan(
      Number(balanceAfter.toString())
    );
  });

  it("Should retrieve the file with specific id", async () => {
    const priceBN = ethers.utils.parseEther("100");
    const rightsID = await filContract
      .connect(accounts[0])
      .storeFile("cidValue", priceBN, tags);
    const file = await filContract.connect(accounts[0]).getFile(1);
    expect(file.watermarkedCid).to.equal("cidValue");
    expect(Number(ethers.utils.formatEther(file.price))).to.equal(100);
  });

  it("Should retrieve all files", async () => {
    const priceBNFirst = ethers.utils.parseEther("100");
    const priceBNSecond = ethers.utils.parseEther("200");
    await filContract
      .connect(accounts[0])
      .storeFile("firstCid", priceBNFirst, tags);
    await filContract
      .connect(accounts[0])
      .storeFile("secondCid", priceBNSecond, tags);
    const filesArray = await filContract.connect(accounts[0]).getAllFiles();
    expect(filesArray.length).to.equal(2);
    expect(filesArray[1].watermarkedCid).to.equal("secondCid");
  });
});
