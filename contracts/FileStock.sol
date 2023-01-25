// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./CreatorNFT.sol";
import "./RightsNFT.sol";


contract FileStock {
    CreatorNFT public creatorNFT;
    RightsNFT public rightsNFT;
    address payable owner;

    // uint256 imagesArray [100];

    

    struct File {
        string watermarkedCid;
        address creator;
        uint256 tokenId;
        uint256 price;
    }
    // id => cid
    mapping(uint256 => File) public files;
    uint256 public fileCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor(){
        owner = payable(msg.sender);
    }


    function storeFile(string calldata cid, uint256 _price) external returns (uint256) {
        require(_price >= 1 && _price <= 1000);
        // mint nft
        uint256 tokenId = creatorNFT.mint();
        // create rightsNFT
        uint256 rightsId = rightsNFT.addRightsNFT(cid, msg.sender, tokenId);
        fileCount++;
        File memory newFile = File(cid, msg.sender, tokenId, _price);
        files[fileCount] = newFile;
        return rightsId;
    }

    function buyFile(uint256 id) external payable {
        require(id > 0 && id <= fileCount, "invalid id");
        //payment
        require(msg.value == files[id].price, "you must pay the exact price of the image");
        uint payment = msg.value;
        address payable recipient = payable(files[id].creator);
        recipient.transfer(payment * 99 / 100);
        owner.transfer(payment * 1 / 100);
        // mint rightsNFT
        rightsNFT.mint(id, msg.sender);
    }

    function getFile(uint256 id) external view returns (File memory) {
        return files[id];
    }

    function getAllFiles() external view returns (File[] memory) {
        File[] memory allFiles = new File[](fileCount);
        for (uint256 i = 0; i < fileCount; i++) {
            allFiles[i] = files[i + 1];
        }
        return allFiles;
    }
}
