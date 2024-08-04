// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { SelfGod } from "../access/SelfGod.sol";

contract ThanksCoin is SelfGod, ERC20("Selfverse ThanksCoin", "TNKS") {
  function _convertWithDecimals(uint256 amount) private view returns (uint256) {
    return amount * 10 ** decimals();
  }

  function mint(address receiver, uint256 amount) external onlyOperator nonReentrant {
    require(receiver != address(0), "Receiver must be specified.");
    require(amount > 0, "Amount of $TNKS must be greater than 0.");

    _mint(receiver, _convertWithDecimals(amount));
  }
}
