// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { ISoulboundToken } from "./ISoulboundToken.sol";

interface IAchievementToken is ISoulboundToken {
  function mint(address receiver) external;
}
