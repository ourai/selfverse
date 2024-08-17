// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { ITokenFunds } from "./ITokenFunds.sol";
import { SelfGod } from "./access/SelfGod.sol";

contract TokenFunds is SelfGod, ITokenFunds {
  uint256 private _fundBalance;
  uint256 private _totalReceived;

  string private _paymentToken;
  string private _nativeToken;
  string[] private _tokenSymbols;
  mapping(string symbol => address) private _tokenContractMap;

  constructor(string memory nativeToken) {
    _nativeToken = nativeToken;
    _setPaymentToken(nativeToken);
  }

  function isNativeToken(string memory tokenSymbol) public view returns (bool) {
    return Strings.equal(tokenSymbol, _nativeToken);
  }

  function isTokenValid(string memory tokenSymbol) public view returns (bool) {
    return isNativeToken(tokenSymbol) || _tokenContractMap[tokenSymbol] != address(0);
  }

  function _setPaymentToken(string memory tokenSymbol) private {
    require(isTokenValid(tokenSymbol), "Specific token isn't supported.");
    _paymentToken = tokenSymbol;
  }

  function getPaymentToken() public view returns (string memory) {
    return _paymentToken;
  }

  function getPaymentTokenContract() public view returns (address) {
    return _tokenContractMap[getPaymentToken()];
  }

  function updatePaymentToken(string calldata newTokenSymbol) external onlyOwner {
    _setPaymentToken(newTokenSymbol);
  }

  function addToken(string calldata symbol, address contractAddr) external onlyOwner {
    if (_tokenContractMap[symbol] == address(0)) {
      _tokenSymbols.push(symbol);
    }

    _tokenContractMap[symbol] = contractAddr;
  }

  function _withdrawNativeToken(address payable receiver, uint256 amount) private {
    (bool success, ) = receiver.call{value: amount}("");
    require(success, "Withdraw failed.");
  }

  function _withdrawStablecoinToken(address receiver, uint256 amount) private {
    bool success = IERC20(getPaymentTokenContract()).transfer(receiver, amount);
    require(success, "Withdraw failed.");
  }

  function withdraw(address receiver, uint256 amount) external onlyAdmin nonReentrant {
    string memory tokenSymbol = getPaymentToken();

    require(isTokenValid(tokenSymbol), "The payment token isn't valid.");

    if (isNativeToken(tokenSymbol)) {
      _withdrawNativeToken(payable(receiver), amount);
    } else {
      _withdrawStablecoinToken(receiver, amount);
    }

    _fundBalance -= amount;
  }

  function deposit() external payable returns (bool) {
    require(isNativeToken(getPaymentToken()), "Payment token isn't native token.");
    return true;
  }

  function increaseReceived(uint256 amount) external {
    _fundBalance += amount;
    _totalReceived += amount;
  }

  function getBalance() external view returns (uint256) {
    return _fundBalance;
  }

  function getReceived() external view returns (uint256) {
    return _totalReceived;
  }
}
