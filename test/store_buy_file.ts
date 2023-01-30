import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, providers } from "ethers";
import { ethers, network } from "hardhat";
import { int } from "hardhat/internal/core/params/argumentTypes";
import { FileStock, CreatorNFT, RightsNFT} from "../typechain-types";
import { BigNumber } from 'bignumber.js';

const FIL: string = "";
const FIL_WHALE: string = "";
const AMOUNT_SUPPLY = 1000n * 10n ** 18n // 1000 FIL
const tags = [2, 4];

describe("Store and buy file", function () {
    let accounts: SignerWithAddress[];
    let filContract : Contract;
    let creatorNFTContract : Contract;
    let rightsNFTContract : Contract;
    let fileStructArray : FileStock.FileStruct[];
    

    this.beforeEach(async() => {
        accounts = await ethers.getSigners();

        const creatorNFTFactory = await ethers.getContractFactory("CreatorNFT");
        creatorNFTContract = await creatorNFTFactory.deploy() as CreatorNFT;
        await creatorNFTContract.deployed();

        const rightsNFTFactory = await ethers.getContractFactory("RightsNFT");
        rightsNFTContract = await rightsNFTFactory.deploy() as RightsNFT;
        await rightsNFTContract.deployed();

        
        const fileStockFactory = await ethers.getContractFactory("FileStock");
        filContract = await fileStockFactory.deploy(creatorNFTContract.address, rightsNFTContract.address) as FileStock;
        await filContract.deployed();

        await creatorNFTContract.connect(accounts[0]).setFileStockAddress(filContract.address);
        await rightsNFTContract.connect(accounts[0]).setFileStockAddress(filContract.address);
    });

    // it("Should store file", async() => {
    //     //how to put file inside fileStructArray?
    // });
    
    it("Should buy file", async() => {
        //storeFile gives Error: Transaction reverted: function returned an unexpected amount of data
        const priceBN = new BigNumber('100');
        const rightsId = await filContract.connect(accounts[0]).storeFile("cidValue" , priceBN, tags);
        const balanceBNBefore = await accounts[1].getBalance();
        const balanceBefore = await ethers.utils.formatEther(balanceBNBefore);
        console.log(balanceBefore);

        await filContract.connect(accounts[0]).buyFile(rightsId);
        const balanceBNAfter = await accounts[1].getBalance();
        const balanceAfter = await ethers.utils.formatEther(balanceBNAfter);
        expect(10).to.be.greaterThan(5);
        expect((+balanceBefore).toFixed(2)).to.be.greaterThan((+balanceAfter).toFixed(2));
      
    });

    // it("Should retrieve the file with specific id", async() => {
    //     const rightsID = await filContract.connect(accounts[0]).storeFile("cidValue" , 100, tags);
    //     const file = await filContract.connect(accounts[0]).getFile(rightsID);
    //     expect("cidValue").to.equal(file.watermarkCid); 
    // });

    // it("Should retrieve all files", async() => {
    //     const firstRightsID = await filContract.connect(accounts[0]).storeFile("firstCid" , 100, tags);
    //     const secondRightsID = await filContract.connect(accounts[0]).storeFile("secondCid" , 100, tags);
    //     const filesArray = await filContract.connect(accounts[0]).getAllFiles();
    //     expect(filesArray.length).to.equal(2);

    // });

   

});





