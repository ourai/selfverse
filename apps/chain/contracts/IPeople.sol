// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { ISelfGod } from "./access/ISelfGod.sol";

interface IPeople is ISelfGod {
  function add(address walletAddr) external;
  function update(uint256 id, address oldWalletAddr, address newWalletAddr) external;
}
