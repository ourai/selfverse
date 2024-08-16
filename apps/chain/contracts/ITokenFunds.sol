// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { ISelfGod } from "./access/ISelfGod.sol";

interface ITokenFunds {
  function getPaymentToken() external view returns (string memory);
  function getPaymentTokenContract() external view returns (address);
  function isNativeToken(string memory tokenSymbol) external view returns (bool);
  function isTokenValid(string memory tokenSymbol) external view returns (bool);
  function updatePaymentToken(string calldata newTokenSymbol) external;
  function addToken(string calldata symbol, address contractAddr) external;
  function withdraw(address receiver, uint256 amount) external;
  function increaseReceived(uint256 amount) external;
  function getBalance() external view returns (uint256);
  function getReceived() external view returns (uint256);
}
