import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";
import { FileStock} from "../typechain-types";

const FIL: string = "";
const FIL_WHALE: string = "";
const AMOUNT_SUPPLY = 1000n * 10n ** 18n // 1000 FIL

describe("Test provide and withdraw liquidity", function () {
    let accounts: SignerWithAddress[];
    let fil: Contract;
    let filWhale : SignerWithAddress;
    let fileStock: FileStock;

    beforeEach(async () => {
        accounts = await ethers.getSigners();

        fil = await ethers.getContractAt("IERC20", FIL);
        filWhale = await ethers.getSigner(FIL_WHALE);

        await fil.connect(filWhale).transfer(accounts[0].address, AMOUNT_SUPPLY);

        const fileStockFactory = await ethers.getContractFactory("FileStock");
        fileStock = await fileStockFactory.deploy() as FileStock;
        await fileStock.deployed();

    });

    it("Should send fil to first account ", async () => {
        const balanceOfAccount0 = await fil.balanceOf(accounts[0].address);
        const balanceOfAcc0Formatted = ethers.utils.formatEther(balanceOfAccount0);
        expect(balanceOfAcc0Formatted).to.eq("1000.0");
    });

});
