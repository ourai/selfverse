// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { SelfGod } from "./access/SelfGod.sol";
import { IAchievementToken } from "./token/IAchievementToken.sol";

contract PaidWorks is SelfGod {
  struct Works {
    uint256 id;
    uint256 price;
    address badgeContract;
    uint256 createdAt;
    uint256 listedAt;
    bool listing;
  }

  struct WorksMetadata {
    string title;
    string cover;
    string description;
    string content;
  }

  struct WorksWithMetadata {
    uint256 id;
    uint256 price;
    address badgeContract;
    uint256 createdAt;
    uint256 listedAt;
    bool listing;
    string title;
    string cover;
    string description;
    string content;
  }

  struct SoldWorks {
    uint256 id;
    address buyer;
    uint256 soldAt;
  }

  uint256[] private _worksIds;
  mapping(uint256 => Works) private _publishedWorks;
  mapping(uint256 => WorksMetadata) private _metadataForWorks;
  mapping(uint256 => SoldWorks) private _soldWorks;

  function _checkExists(uint256 id) private view {
    require(_publishedWorks[id].createdAt != 0, "Specific works does't exist.");
  }

  function updateMetadata(
    uint256 id,
    string calldata title,
    string calldata cover,
    string calldata description,
    string calldata content
  ) public onlyAdmin {
    _checkExists(id);
    _metadataForWorks[id] = WorksMetadata(title, cover, description, content);
  }

  function add(
    uint256 price,
    address badgeContract,
    string calldata title,
    string calldata cover,
    string calldata description,
    string calldata content
  ) public onlyAdmin {
    uint256 id = _worksIds.length + 1;
    _publishedWorks[id] = Works(id, price, badgeContract, block.timestamp, 0, false);
    _worksIds.push(id);
    updateMetadata(id, title, cover, description, content);
  }

  // function add(uint256 price) external {
  //   add(price, address(0));
  // }

  function updatePrice(uint256 id, uint256 price) external onlyAdmin {
    _checkExists(id);
    _publishedWorks[id].price = price;
  }

  function updateBadge(uint256 id, address badgeContract) external onlyAdmin {
    _checkExists(id);
    _publishedWorks[id].badgeContract = badgeContract;
  }

  // function remove(uint256 id) external onlyAdmin {
  //   _checkExists(id);
  //   // TODO: remove item
  // }

  function sell(uint256 id) external onlyAdmin {
    _checkExists(id);
    _publishedWorks[id].listedAt = block.timestamp;
    _publishedWorks[id].listing = true;
  }

  function unlist(uint256 id) external onlyAdmin {
    _checkExists(id);
    _publishedWorks[id].listing = false;
  }

  function buy(uint256 id) external payable whenNotPaused {
    _checkExists(id);

    Works memory targetWorks = _publishedWorks[id];

    require(targetWorks.listing, "Not listing.");
    require(msg.value == targetWorks.price, "Insufficient payment.");

    address buyer = _msgSender();
    _soldWorks[id] = SoldWorks(id, buyer, block.timestamp);

    if (targetWorks.badgeContract != address(0)) {
      IAchievementToken badge = IAchievementToken(targetWorks.badgeContract);
      badge.mint(buyer);
    }
  }

  function getAllWorks() external view returns (WorksWithMetadata[] memory) {
    uint256 total = _worksIds.length;
    WorksWithMetadata[] memory allWorks = new WorksWithMetadata[](total);

    uint256 id;
    Works memory works;
    WorksMetadata memory metadata;

    for (uint256 i; i < total; i++) {
      id = _worksIds[i];
      works = _publishedWorks[id];
      metadata = _metadataForWorks[id];

      allWorks[i] = WorksWithMetadata(
        works.id,
        works.price,
        works.badgeContract,
        works.createdAt,
        works.listedAt,
        works.listing,
        metadata.title,
        metadata.cover,
        metadata.description,
        metadata.content
      );
    }

    return allWorks;
  }
}
