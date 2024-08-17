// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { SelfGod } from "./access/SelfGod.sol";
import { FundsSponsor } from "./FundsSponsor.sol";
import { IAchievementToken } from "./token/IAchievementToken.sol";

contract PaidWorks is SelfGod, FundsSponsor {
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
    bool bought;
  }

  struct WorksBuyer {
    address buyer;
    uint256 soldAt;
  }

  struct SoldRecord {
    WorksBuyer[] buyers;
  }

  struct BoughtRecord {
    uint256 id;
    uint256 boughtAt;
  }

  struct BoughtWorks {
    uint256 id;
    string title;
    string cover;
    string description;
    uint256 boughtAt;
  }

  struct Chapter {
    string title;
    string description;
    string subject;
    uint256 subjectId;
  }

  uint256[] private _worksIds;

  mapping(uint256 => Works) private _publishedWorks;
  mapping(uint256 => WorksMetadata) private _metadataForWorks;
  mapping(uint256 => SoldRecord) private _soldRecords;
  mapping(uint256 => mapping(address => bool)) private _buyers;
  mapping(address buyer => BoughtRecord[]) private _boughtWorks;
  mapping(uint256 id => Chapter[]) private _chapterMap;

  constructor(address tokenFunds) FundsSponsor(tokenFunds) {}

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

  function updateChapters(uint256 id, Chapter[] memory chapters) external onlyAdmin {
    _checkExists(id);
    delete _chapterMap[id];

    Chapter memory chapter;

    for (uint256 i; i < chapters.length; i++) {
      chapter = chapters[i];
      _chapterMap[id].push(Chapter(chapter.title, chapter.description, chapter.subject, chapter.subjectId));
    }
  }

  function getChapters(uint256 id) external view returns (Chapter[] memory) {
    _checkExists(id);
    return _chapterMap[id];
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

  function _buy(uint256 id, uint256 amount) private fundsExists {
    _checkExists(id);

    Works memory targetWorks = _publishedWorks[id];

    require(targetWorks.listing, "Not listing.");
    require(amount == targetWorks.price, "Insufficient payment.");

    address buyer = _msgSender();

    require(_buyers[id][buyer] == false, "Already purchased.");
    _buyers[id][buyer] = true;
    uint256 soldAt = block.timestamp;
    _soldRecords[id].buyers.push(WorksBuyer(buyer, soldAt));
    _boughtWorks[buyer].push(BoughtRecord(id, soldAt));

    if (targetWorks.badgeContract != address(0)) {
      IAchievementToken badge = IAchievementToken(targetWorks.badgeContract);
      badge.mint(buyer);
    }
  }

  function buy(uint256 id, uint256 amount) external whenNotPaused {
    _buy(id, amount);
    _deposit(amount, false);
  }

  function buy(uint256 id) external payable whenNotPaused {
    _buy(id, msg.value);
    _deposit(msg.value, true);
  }

  function _getWorkWithMetadata(uint256 id, address operator) private view returns (WorksWithMetadata memory) {
    _checkExists(id);
    Works memory workBasic = _publishedWorks[id];
    WorksMetadata memory workMetadata = _metadataForWorks[id];

    return WorksWithMetadata(
      workBasic.id,
      workBasic.price,
      workBasic.badgeContract,
      workBasic.createdAt,
      workBasic.listedAt,
      workBasic.listing,
      workMetadata.title,
      workMetadata.cover,
      workMetadata.description,
      workMetadata.content,
      _buyers[id][operator]
    );
  }

  function getAllWorks(address operator) public view returns (WorksWithMetadata[] memory) {
    uint256 total = _worksIds.length;
    WorksWithMetadata[] memory allWorks = new WorksWithMetadata[](total);

    for (uint256 i; i < total; i++) {
      allWorks[i] = _getWorkWithMetadata(_worksIds[i], operator);
    }

    return allWorks;
  }

  function getAllWorks() external view returns (WorksWithMetadata[] memory) {
    return getAllWorks(_msgSender());
  }

  function getBuyers(uint256 id) external view returns (WorksBuyer[] memory) {
    _checkExists(id);
    return _soldRecords[id].buyers;
  }

  function getBoughtWorks(address buyer) external view returns (BoughtWorks[] memory) {
    uint256 total = _boughtWorks[buyer].length;
    BoughtWorks[] memory boughtWorks = new BoughtWorks[](total);
    BoughtRecord memory record;
    WorksWithMetadata memory work;

    for (uint256 i; i < total; i++) {
      record = _boughtWorks[buyer][i];
      work = _getWorkWithMetadata(record.id, buyer);
      boughtWorks[i] = BoughtWorks(record.id, work.title, work.cover, work.description, record.boughtAt);
    }

    return boughtWorks;
  }
}
