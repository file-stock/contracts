// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./FileStock.sol";

contract CreatorNFT is ERC721Enumerable {
    FileStock public filestock;

    constructor(FileStock _filestock) ERC721("CreatorNFT", "CNFT") {
        filestock = _filestock;
    }

    function mint() external returns (uint256) {
        require(msg.sender == address(filestock), "only filestock can mint");
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
        return tokenId;
    }
}
