// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./CreatorNFT.sol";
import "./RightsNFT.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "hardhat/console.sol";

contract FileStock is ERC721Enumerable, ERC721Holder{
    CreatorNFT public creatorNFT;
    RightsNFT public rightsNFT;
    address payable owner;

    struct File {
        string watermarkedCid;
        address creator;
        uint256 tokenId;
        uint256 price;
        uint256[] fileTags;
    }
    // id => cid
    mapping(uint256 => File) public files;
    uint256 public fileCount;

    event StoreFile(address indexed creator, uint256 price, uint256 rightsId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor(address _creatorNFTAddress, address _rightNFTAddress) ERC721("FileStock", "FS"){
        creatorNFT = CreatorNFT(_creatorNFTAddress);
        rightsNFT = RightsNFT(_rightNFTAddress);
        owner = payable(msg.sender);
    }

    function storeFile(string calldata cid, uint256 _price, uint256[] memory tags) external {
        require(_price >= 1 && _price <= 1000);
        // mint nft
        uint256 tokenId = creatorNFT.mint();
        // create rightsNFT
        uint256 rightsId = rightsNFT.addRightsNFT(cid, msg.sender, tokenId);
        fileCount++;
        File memory newFile = File(cid, msg.sender, tokenId, _price, tags);
        files[fileCount] = newFile;
        emit StoreFile(msg.sender, _price, rightsId);
    }

    function buyFile(uint256 id) external payable {
        console.log("why not here");
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
