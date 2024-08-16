// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { ISoulboundToken } from "./ISoulboundToken.sol";

interface IDonation is ISoulboundToken {
  function donateFor(address donator, uint256 amount, string memory subject, uint256 subjectId) external;
  function donate() external payable;
  function getReceived() external view returns (uint256);
}
