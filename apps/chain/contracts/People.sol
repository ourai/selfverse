// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { SelfGod } from "./access/SelfGod.sol";

contract People is SelfGod {
  uint256 private _totalPeople;

  struct Person {
    address walletAddr;
  }

  mapping(uint256 id => Person) private _personMap;
  mapping(address walletAddr => uint256) private _idMap;

  function add(address walletAddr) external onlyOperator {
    require(_idMap[walletAddr] == 0, "Wallet address has been added.");

    uint256 id = _totalPeople + 1;

    _personMap[id] = Person(walletAddr);
    _idMap[walletAddr] = id;

    _totalPeople = id;
  }

  function update(uint256 id, address oldWalletAddr, address newWalletAddr) external onlyOperator {
    require(_personMap[id].walletAddr == oldWalletAddr, "Current operator doesn't exists.");

    _personMap[id].walletAddr = newWalletAddr;
    _idMap[newWalletAddr] = id;

    delete _idMap[oldWalletAddr];
  }
}
