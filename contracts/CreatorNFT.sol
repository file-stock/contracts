// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./FileStock.sol";

contract CreatorNFT is ERC721Enumerable {
    FileStock public filestock;
    address fileStockAddress;
    address owner;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    constructor() ERC721("CreatorNFT", "CNFT") {
        owner = msg.sender;
    }

    function setFileStockAddress(address _fileStockAddress) public onlyOwner {
        fileStockAddress = _fileStockAddress;
        filestock = FileStock(fileStockAddress);
    }

    function mint(address creator) external returns (uint256) {
        require(msg.sender == address(filestock), "only filestock can mint");
        uint256 tokenId = totalSupply() + 1;
        _safeMint(creator, tokenId);
        return tokenId;
    }
}
