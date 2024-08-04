// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { SoulboundToken } from "./SoulboundToken.sol";
import { IAchievementToken } from "./IAchievementToken.sol";

abstract contract AchievementToken is SoulboundToken, IAchievementToken {
  struct Badge {
    uint256 tokenId;
    address owner;
    uint256 mintedAt;
  }

  mapping(uint256 => Badge) private _badges;
  mapping(address => uint256) private _minters;
  address[] private _allMinters;

  constructor(string memory tokenName, string memory tokenSymbol, string memory tokenBaseURI)
    SoulboundToken(tokenName, tokenSymbol, tokenBaseURI)
  {}

  function mint(address receiver) external onlyOperator nonReentrant {
    require(_minters[receiver] == 0, string.concat(name(), " had been minted."));

    uint256 tokenId = _nextTokenId();

    _safeMint(receiver, tokenId);
    _allMinters.push(receiver);

    _badges[tokenId] = Badge(tokenId, receiver, block.timestamp);
    _minters[receiver] = tokenId;
  }

  function getAll() external view returns (Badge[] memory) {
    uint256 total = totalSupply();
    Badge[] memory badges = new Badge[](total);

    for (uint256 i; i < total; i++) {
      badges[i] = _badges[tokenByIndex(i)];
    }

    return badges;
  }
}
