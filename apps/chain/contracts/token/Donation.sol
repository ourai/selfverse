// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { FundsSponsor } from "../FundsSponsor.sol";
import { SoulboundToken } from "./SoulboundToken.sol";
import { IDonation } from "./IDonation.sol";

contract Donation is FundsSponsor, SoulboundToken, IDonation {
  uint256 private constant _mintableAmount = 1 * 10 ** 18;  // 1 ETH
  uint256 private _totalReceived;

  struct Record {
    address donator;
    uint256 amount;
    string subject;
    uint256 subjectId;
    uint256 donatedAt;
  }

  struct Donator {
    address donator;
    uint256 amount;
    uint256 tokenId;
  }

  Record[] private _allDonations;
  address[] private _allDonators;

  mapping(address => Donator) private _donators;

  constructor(address tokenFunds, string memory tokenBaseURI)
    FundsSponsor(tokenFunds)
    SoulboundToken("Selfverse Donator", "SV-DNTR", tokenBaseURI)
  {}

  function _updateDonator(address donator, uint256 amount) private {
    Donator memory cachedDonator = _donators[donator];
    uint256 donatedAmount = amount;

    if (cachedDonator.donator == address(0)) {
      _allDonators.push(donator);
    } else {
      donatedAmount += cachedDonator.amount;
    }

    uint256 tokenId = cachedDonator.tokenId;
    bool mintable = false;

    if (tokenId == 0 && donatedAmount >= _mintableAmount) {
      tokenId = _nextTokenId();
      mintable = true;
    }

    _donators[donator] = Donator(donator, donatedAmount, tokenId);

    if (mintable) {
      _safeMint(donator, tokenId);
    }
  }

  function donateFor(address donator, uint256 amount, string memory subject, uint256 subjectId) public fundsExists {
    require(amount > 0, "The donation amount must be greater than 0.");

    _totalReceived += amount;

    _allDonations.push(Record(donator, amount, subject, subjectId, block.timestamp));
    _updateDonator(donator, amount);
  }

  function _donateForPerson(uint256 amount) private {
    donateFor(_msgSender(), amount, "person", 0);
  }

  function donate(uint256 amount) external whenNotPaused nonReentrant {
    _donateForPerson(amount);
    _deposit(amount, false);
  }

  function donate() external payable whenNotPaused nonReentrant {
    _donateForPerson(msg.value);
    _deposit(msg.value, true);
  }

  function getReceived() external view returns (uint256) {
    return _totalReceived;
  }

  function getDonators() external view returns (Donator[] memory) {
    Donator[] memory donators = new Donator[](_allDonators.length);

    for (uint256 i = 0; i < _allDonators.length; i++) {
      donators[i] = _donators[_allDonators[i]];
    }

    return donators;
  }

  function _getFilteredDonationCount(address donator) private view returns (uint256) {
    uint256 total = _allDonations.length;
    uint256 filteredCount;

    for (uint256 i; i < total; i++) {
      if (_allDonations[i].donator == donator) {
        filteredCount += 1;
      }
    }

    return filteredCount;
  }

  function _getFilteredDonations(address donator) private view returns (Record[] memory) {
    Record[] memory filtered = new Record[](_getFilteredDonationCount(donator));
    Record memory record;
    uint256 total = _allDonations.length;
    uint256 nextIndex;

    for (uint256 i; i < total; i++) {
      record = _allDonations[i];

      if (record.donator == donator) {
        filtered[nextIndex] = record;
        nextIndex += 1;
      }
    }

    return filtered;
  }

  function getDonations(address donator) public view returns (Record[] memory) {
    return donator == address(0) ? _allDonations : _getFilteredDonations(donator);
  }

  function getDonations() external view returns (Record[] memory) {
    return getDonations(address(0));
  }
}
