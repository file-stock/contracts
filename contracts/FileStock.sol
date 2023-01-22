// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./CreatorNFT.sol";
import "./RightsNFT.sol";

contract FileStock {
    CreatorNFT public creatorNFT;
    RightsNFT public rightsNFT;

    struct File {
        string watermarkedCid;
        address creator;
        uint256 tokenId;
    }
    // id => cid
    mapping(uint256 => File) public files;
    uint256 public fileCount;

    function storeFile(string calldata cid) external returns (uint256) {
        // mint nft
        uint256 tokenId = creatorNFT.mint();
        // create rightsNFT
        uint256 rightsId = rightsNFT.addRightsNFT(cid, msg.sender, tokenId);
        fileCount++;
        File memory newFile = File(cid, msg.sender, tokenId);
        files[fileCount] = newFile;
        return rightsId;
    }

    function buyFile(uint256 id) external {
        require(id > 0 && id <= fileCount, "invalid id");
        // todo add payment
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
