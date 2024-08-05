// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { AccessControlEnumerable } from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import { ISelfGod } from "./ISelfGod.sol";

// Self is the God of Selfverse
abstract contract SelfGod is Ownable(msg.sender), AccessControlEnumerable, ReentrancyGuard, ISelfGod {
  bytes32 public constant SV_OWNER = keccak256("SV_OWNER");
  bytes32 public constant SV_ADMIN = keccak256("SV_ADMIN");
  bytes32 public constant SV_OPERATOR = keccak256("SV_OPERATOR");

  constructor() {
    _setRoleAdmin(SV_ADMIN, SV_OWNER);
    _setRoleAdmin(SV_OPERATOR, SV_ADMIN);
  }

  modifier onlyAdmin() {
    _checkRole(SV_ADMIN);
    _;
  }

  modifier onlyOperator() {
    _checkRole(SV_OPERATOR);
    _;
  }

  function _regrantSelfverseRole(bytes32 role, address[] calldata members, bool needClearPrevMembers) private {
    if (needClearPrevMembers) {
      uint256 prevMemberCount = getRoleMemberCount(role);

      while (prevMemberCount > 0) {
        _revokeRole(role, getRoleMember(role, prevMemberCount - 1));
        prevMemberCount = getRoleMemberCount(role);
      }
    }

    for (uint256 i = 0; i < members.length; i++) {
      _grantRole(role, members[i]);
    }
  }

  function _regrantSelfverseRole(bytes32 role, address member) private {
    if (getRoleMemberCount(role) > 0) {
      _revokeRole(role, getRoleMember(role, 0));
    }

    _grantRole(role, member);
  }

  function _transferOwnership(address newOwner) internal override {
    super._transferOwnership(newOwner);
    _regrantSelfverseRole(SV_OWNER, newOwner);
  }

  function updateAdmin(address newAdmin) external onlyOwner {
    _regrantSelfverseRole(SV_ADMIN, newAdmin);
  }

  function updateOperators(address[] calldata newOperators, bool needClearPrevOperators) external onlyAdmin {
    _regrantSelfverseRole(SV_OPERATOR, newOperators, needClearPrevOperators);
  }

  function withdraw(address payable receiver, uint256 amount) external onlyAdmin nonReentrant {
    (bool success, ) = receiver.call{value: amount}("");
    require(success, "Withdraw failed.");
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(ISelfGod).interfaceId || super.supportsInterface(interfaceId);
  }
}
