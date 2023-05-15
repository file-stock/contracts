// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FileStock.sol";

contract RightsNFT is ERC1155, Ownable {
    FileStock public filestock;
    address fileStockAddress;
    address owner;

    struct Data {
        string cid;
        address creator;
        uint256 tokenId;
    }

    // tokenId => Data
    mapping(uint256 => Data) public rightsNFT;
    uint256 public rightsNFTCount;

    constructor() ERC1155("") {}

    function setFileStockAddress(address _fileStockAddress) public onlyOwner {
        fileStockAddress = _fileStockAddress;
        filestock = FileStock(fileStockAddress);
    }

    function mint(uint256 id, address buyer) external {
        require(msg.sender == address(filestock), "only filestock can mint");
        _mint(buyer, id, 1, "");
    }

    function addRightsNFT(
        string calldata cid,
        address creator,
        uint256 tokenId
    ) external returns (uint256) {
        require(msg.sender == address(filestock), "only filestock can mint");
        rightsNFTCount++;
        Data memory newData = Data(cid, creator, tokenId);
        rightsNFT[rightsNFTCount] = newData;
        return rightsNFTCount;
    }
}
