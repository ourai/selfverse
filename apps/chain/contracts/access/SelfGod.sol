// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Self is the God of Selfverse
abstract contract SelfGod is Ownable(msg.sender), ReentrancyGuard {
  function withdraw(address payable receiver, uint256 amount) external nonReentrant {
    (bool success, ) = receiver.call{value: amount}("");
    require(success, "Withdraw failed.");
  }
}
