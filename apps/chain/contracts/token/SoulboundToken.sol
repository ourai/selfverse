// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { IERC165, IERC721, ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC721Enumerable, ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { SelfGod } from "../access/SelfGod.sol";
import { ISelfGod } from "../access/ISelfGod.sol";
import { IncreasableToken } from "./IncreasableToken.sol";
import { ISoulboundToken } from "./ISoulboundToken.sol";

abstract contract SoulboundToken is SelfGod, ERC721Enumerable, IncreasableToken, ISoulboundToken {
  string private _tokenBaseURI;

  constructor(string memory tokenName, string memory tokenSymbol, string memory tokenBaseURI)
    ERC721(tokenName, tokenSymbol)
  {
    _tokenBaseURI = tokenBaseURI;
  }

  function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual override {
    super._safeMint(to, tokenId, data);
    _increaseTokenId();
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _tokenBaseURI;
  }

  function updateBaseURI(string calldata newTokenBaseURI) external onlyAdmin {
    _tokenBaseURI = newTokenBaseURI;
  }

  function transferFrom(address /* from */, address /* to */, uint256 /* tokenId */) public pure override(IERC721, ERC721) {
    revert("Soulbound token can't be transfered.");
  }

  function supportsInterface(bytes4 interfaceId) public view override(IERC165, ERC721Enumerable, SelfGod) returns (bool) {
    return
      interfaceId == type(ISoulboundToken).interfaceId ||
      interfaceId == type(ISelfGod).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
