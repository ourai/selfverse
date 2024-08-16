// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { SelfGod } from "./access/SelfGod.sol";
import { IDonation } from "./token/IDonation.sol";
import { FundsSponsor } from "./FundsSponsor.sol";

contract Article is SelfGod, FundsSponsor {
  IDonation private _donation;

  struct Post {
    uint256 id;
    string title;
    string description;
    string content;
    string banner;
    uint256 createdAt;
    uint256 updatedAt;
    uint256 publishedAt;
    bool published;
  }

  uint256[] private _postIds;
  mapping(uint256 id => Post) private _postMap;

  constructor(address tokenFunds, address donation) FundsSponsor(tokenFunds) {
    require(donation != address(0), "Donation isn't specified.");
    _donation = IDonation(donation);
  }

  function add(
    string calldata title,
    string calldata description,
    string calldata content,
    string calldata banner
  ) external onlyAdmin {
    uint256 id = _postIds.length + 1;
    uint256 timestamp = block.timestamp;
    _postMap[id] = Post(id, title, description, content, banner, timestamp, timestamp, timestamp, false);
  }

  function _checkExists(uint256 id) private view {
    require(_postMap[id].createdAt != 0, "Specific article does't exist.");
  }

  function update(
    uint256 id,
    string calldata title,
    string calldata description,
    string calldata content,
    string calldata banner
  ) external onlyAdmin {
    _checkExists(id);

    _postMap[id].title = title;
    _postMap[id].description = description;
    _postMap[id].content = content;
    _postMap[id].banner = banner;
    _postMap[id].updatedAt = block.timestamp;
  }

  function publish(uint256 id) external onlyAdmin {
    _checkExists(id);

    _postMap[id].published = true;
    _postMap[id].publishedAt = block.timestamp;
  }

  function unpublish(uint256 id) external onlyAdmin {
    _checkExists(id);
    _postMap[id].published = false;
  }

  function donate(uint256 id, uint256 amount) external whenNotPaused nonReentrant {
    _checkExists(id);
    _donation.donateFor(_msgSender(), amount, "article", id);
    _deposit(amount, false);
  }

  function donate(uint256 id) external payable whenNotPaused nonReentrant {
    _checkExists(id);
    _donation.donateFor(_msgSender(), msg.value, "article", id);
    _deposit(msg.value, true);
  }
}
