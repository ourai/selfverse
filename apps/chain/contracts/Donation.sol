// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { IERC721, ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
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
    ERC721("Selfverse Donator", "SV-DNTR")
    SoulboundToken(tokenBaseURI)
  {}

  function _updateDonator(address donator, uint256 amount) private {
    Donator memory cachedDonator = _donators[donator];
    uint256 donatedAmount = amount;

    if (cachedDonator.donator != address(0)) {
      donatedAmount += cachedDonator.amount;
    }

    uint256 tokenId = cachedDonator.tokenId;
    bool mintable = false;

    if (tokenId == 0 && donatedAmount >= _mintableAmount) {
      // TODO: 设置为自增 ID
      mintable = true;
    }

    _donators[donator] = Donator(donator, donatedAmount, tokenId);

    if (mintable) {
      _safeMint(donator, tokenId);
    }
  }

  function donate() external payable nonReentrant {
    uint256 amount = msg.value;

    require(amount > 0, "The donation amount must be greater than 0 ETH.");

    _totalReceived += amount;

    address donator = _msgSender();

    _allDonations.push(Record(donator, amount, block.timestamp));
    _updateDonator(donator, amount);
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

  function withdraw(address payable receiver, uint256 amount) external nonReentrant {
    (bool success, ) = receiver.call{value: amount}("");
    require(success, "Withdraw failed.");
  }
}
