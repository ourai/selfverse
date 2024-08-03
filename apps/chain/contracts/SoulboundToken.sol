// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC721, ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC721Enumerable, ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { SelfGod } from "./SelfGod.sol";

abstract contract SoulboundToken is ERC721Enumerable, SelfGod {
  string private _tokenBaseURI;

  constructor(string memory tokenBaseURI) {
    _tokenBaseURI = tokenBaseURI;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _tokenBaseURI;
  }

  function updateBaseURI(string calldata newTokenBaseURI) external onlyOwner {
    _tokenBaseURI = newTokenBaseURI;
  }

  function transferFrom(address from, address to, uint256 tokenId) public pure override(IERC721, ERC721) {
    revert("Soulbound token can't be transfered.");
  }
}
