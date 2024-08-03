// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { SelfGod } from "./SelfGod.sol";

contract PaidWorks is SelfGod {
  struct Works {
    uint256 id;
    uint256 price;
    address badgeContract;
    uint256 createdAt;
    uint256 listedAt;
    bool listing;
  }

  struct SoldWorks {
    uint256 id;
    address buyer;
    uint256 soldAt;
  }

  uint256[] private _worksIds;
  mapping(uint256 => Works) private _publishedWorks;
  mapping(uint256 => SoldWorks) private _soldWorks;

  function add(uint256 price, address badgeContract) public nonReentrant {
    require(price >= 0, "Price must not be less than 0 ETH.");
    uint256 id = _worksIds.length + 1;
    _publishedWorks[id] = Works(id, price, badgeContract, block.timestamp, 0, false);
    _worksIds.push(id);
  }

  function add(uint256 price) external {
    add(price, address(0));
  }

  function _checkExists(uint256 id) private view {
    require(_publishedWorks[id].createdAt != 0, "Specific works does't exist.");
  }

  function sell(uint256 id) external {
    _checkExists(id);
    _publishedWorks[id].listedAt = block.timestamp;
    _publishedWorks[id].listing = true;
  }

  function unlist(uint256 id) external {
    _checkExists(id);
    _publishedWorks[id].listing = false;
  }

  function buy(uint256 id) external payable nonReentrant {
    _checkExists(id);

    Works memory targetWorks = _publishedWorks[id];

    require(msg.value == targetWorks.price, "Insufficient payment.");

    _soldWorks[id] = SoldWorks(id, msg.sender, block.timestamp);

    if (targetWorks.badgeContract != address(0)) {
      // TODO: mint badge to buyer
    }
  }

  function getAllWorks() external view returns (Works[] memory) {
    uint256 total = _worksIds.length;
    Works[] memory allWorks = new Works[](total);

    for (uint256 i; i < total; i++) {
      allWorks[i] = _publishedWorks[_worksIds[i]];
    }

    return allWorks;
  }

  function withdraw(address payable receiver, uint256 amount) external nonReentrant {
    (bool success, ) = receiver.call{value: amount}("");
    require(success, "Withdraw failed.");
  }
}
