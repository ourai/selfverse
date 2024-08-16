// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { ITokenFunds } from "./ITokenFunds.sol";
import { ISelfGod } from "./access/ISelfGod.sol";
import { SelfGod } from "./access/SelfGod.sol";

contract SystemSettings is SelfGod {
  string private constant TOKEN_FUNDS_KEY = "funds";

  struct ModuleParam {
    string key;
    address contractAddr;
  }

  struct ModuleStorage {
    address contractAddr;
    address admin;
  }

  struct SystemModule {
    string key;
    address contractAddr;
  }

  mapping(string key => ModuleStorage) private _moduleMap;
  string[] private _moduleKeys;

  constructor(address tokenFunds, ModuleParam[] memory modules) {
    _addModule(ModuleParam(TOKEN_FUNDS_KEY, tokenFunds));

    for (uint256 i; i < modules.length; i++) {
      _addModule(modules[i]);
    }
  }

  function _addModule(ModuleParam memory module) private {
    _moduleMap[module.key] = ModuleStorage(module.contractAddr, address(0));
    _moduleKeys.push(module.key);
  }

  function _getTokenFundsContract() private view returns (address) {
    return _moduleMap[TOKEN_FUNDS_KEY].contractAddr;
  }

  function getPaymentToken() external view returns (string memory) {
    return ITokenFunds(_getTokenFundsContract()).getPaymentToken();
  }

  function updatePaymentToken(string calldata newTokenSymbol) external onlyOwner {
    ITokenFunds(_getTokenFundsContract()).updatePaymentToken(newTokenSymbol);
  }

  function getModules() external view returns (SystemModule[] memory) {
    SystemModule[] memory modules = new SystemModule[](_moduleKeys.length);
    string memory key;

    for (uint256 i; i < _moduleKeys.length; i++) {
      key = _moduleKeys[i];
      modules[i] = SystemModule(key, _moduleMap[key].contractAddr);
    }

    return modules;
  }

  function updateAdminForModules(address admin) external onlyOwner {
    require(admin != address(0), "Admin can't be the zero address.");

    for (uint256 i; i < _moduleKeys.length; i++) {
      ISelfGod(_moduleMap[_moduleKeys[i]].contractAddr).updateAdmin(admin);
    }
  }
}
