// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { IAccessControlEnumerable } from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

interface ISelfGod is IAccessControlEnumerable {
  function updateAdmin(address newAdmin) external;
  function updateOperators(address[] calldata newOperators, bool needClearPrevOperators) external;
  function pause() external;
  function unpause() external;
}
