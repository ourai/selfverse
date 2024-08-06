// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { SoulboundToken } from "./SoulboundToken.sol";

contract Donation is SoulboundToken {
  uint256 private constant _mintableAmount = 1 * 10 ** 18;  // 1 ETH
  uint256 private _totalReceived;

  struct Record {
    address donator;
    uint256 amount;
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

  constructor(string memory tokenBaseURI)
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

  function donate() external payable whenNotPaused nonReentrant {
    uint256 amount = msg.value;

    require(amount > 0, "The donation amount must be greater than 0 ETH.");

    _totalReceived += amount;

    address donator = _msgSender();

    _allDonations.push(Record(donator, amount, block.timestamp));
    _updateDonator(donator, amount);
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

  function getDonations() external view returns (Record[] memory) {
    return _allDonations;
  }
}
