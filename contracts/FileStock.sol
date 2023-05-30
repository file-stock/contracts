// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./CreatorNFT.sol";
import "./RightsNFT.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract FileStock is ERC721Enumerable {
    CreatorNFT public creatorNFT;
    RightsNFT public rightsNFT;

    struct File {
        string watermarkedCid;
        string encryptedCid;
        address creator;
        uint256 tokenId;
        uint256 price;
        uint256[] fileTags;
        bool finalized;
    }
    // id => cid
    mapping(uint256 => File) public files;
    uint256 public fileCount;

    event StartUpload(address indexed creator, uint256 price, uint256 tokenId);
    event FinalizeUpload(address indexed creator, uint256 tokenId);
    event BuyFile(address indexed buyer, uint256 tokenId);

    constructor(
        address _creatorNFTAddress,
        address _rightNFTAddress
    ) ERC721("FileStock", "FS") {
        creatorNFT = CreatorNFT(_creatorNFTAddress);
        rightsNFT = RightsNFT(_rightNFTAddress);
    }

    function startUpload(
        string calldata cid,
        uint256 _price,
        uint256[] memory tags
    ) external {
        require(_price >= 0.1 ether && _price <= 1000 ether, "wrong price");
        // mint nft
        uint256 tokenId = creatorNFT.mint(msg.sender);
        // create rightsNFT
        uint256 rightsId = rightsNFT.addRightsNFT(cid, msg.sender, tokenId);
        fileCount++;
        File memory newFile = File(
            cid,
            "",
            msg.sender,
            tokenId,
            _price,
            tags,
            false
        );
        files[fileCount] = newFile;
        emit StartUpload(msg.sender, _price, rightsId);
    }

    function finalizeUpload(
        uint256 _tokenId,
        string calldata _encryptedCid
    ) external {
        require(msg.sender == files[_tokenId].creator, "not creator");
        require(!files[_tokenId].finalized, "file already finalized");
        files[_tokenId].encryptedCid = _encryptedCid;
        files[_tokenId].finalized = true;
    }

    function buyFile(uint256 id) external payable {
        require(id > 0 && id <= fileCount, "invalid id");
        //payment
        require(
            msg.value == files[id].price,
            "you must pay the exact price of the image"
        );
        require(files[id].finalized, "upload not finalized");
        uint256 payment = msg.value;
        address payable recipient = payable(files[id].creator);
        recipient.transfer(payment);
        // mint rightsNFT
        rightsNFT.mint(id, msg.sender);
        emit BuyFile(msg.sender, id);
    }

    function getFile(uint256 id) external view returns (File memory) {
        require(files[id].finalized, "file not finalized");
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
