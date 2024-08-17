// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ITokenFunds } from "./ITokenFunds.sol";

abstract contract FundsSponsor {
  address internal _tokenFunds;

  constructor(address tokenFunds) {
    _tokenFunds = tokenFunds;
  }

  modifier fundsExists {
    require(_tokenFunds != address(0), "Token funds isn't specified.");
    _;
  }

  function _deposit(uint256 amount, bool nativeTokenUsed) internal {
    if (amount == 0) {
      return;
    }

    ITokenFunds funds = ITokenFunds(_tokenFunds);
    string memory tokenSymbol = funds.getPaymentToken();
    bool depositSuccess;

    if (nativeTokenUsed) {
      require(funds.isNativeToken(tokenSymbol), "Payment token isn't native token.");
      // (bool success, ) = payable(_tokenFunds).call{value: amount}("");
      // depositSuccess = success;
      depositSuccess = funds.deposit{value: amount}();
    } else {
      require(funds.isTokenValid(tokenSymbol) && !funds.isNativeToken(tokenSymbol), "Payment token isn't valid token.");
      depositSuccess = IERC20(funds.getPaymentTokenContract()).transferFrom(address(this), _tokenFunds, amount);
    }

    require(depositSuccess, "Deposit failed.");
    funds.increaseReceived(amount);
  }
}
