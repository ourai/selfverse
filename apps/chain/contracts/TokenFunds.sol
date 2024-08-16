// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { ITokenFunds } from "./ITokenFunds.sol";
import { SelfGod } from "./access/SelfGod.sol";

contract TokenFunds is ITokenFunds, SelfGod {
  uint256 private _fundBalance;
  uint256 private _totalReceived;

  string private _paymentToken;
  string private _nativeToken;
  string[] private _tokenSymbols;
  mapping(string symbol => address) private _tokenContractMap;

  constructor(string memory nativeToken, string memory paymentToken) {
    _nativeToken = nativeToken;
    _setPaymentToken(paymentToken);
  }

  function _isNativeToken(string memory tokenSymbol) private view returns (bool) {
    return Strings.equal(tokenSymbol, _nativeToken);
  }

  function _isTokenValid(string memory tokenSymbol) private view returns (bool) {
    return _isNativeToken(tokenSymbol) || _tokenContractMap[tokenSymbol] != address(0);
  }

  function _setPaymentToken(string memory tokenSymbol) private {
    require(_isTokenValid(tokenSymbol), "Specific token isn't supported.");
    _paymentToken = tokenSymbol;
  }

  function getPaymentToken() public view returns (string memory) {
    return _paymentToken;
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
    bool success = IERC20(_tokenContractMap[getPaymentToken()]).transfer(receiver, amount);
    require(success, "Withdraw failed.");
  }

  function withdraw(address receiver, uint256 amount) external onlyAdmin nonReentrant {
    string memory tokenSymbol = getPaymentToken();

    require(_isTokenValid(tokenSymbol), "The payment token isn't valid.");

    if (_isNativeToken(tokenSymbol)) {
      _withdrawNativeToken(payable(receiver), amount);
    } else {
      _withdrawStablecoinToken(receiver, amount);
    }

    _fundBalance -= amount;
  }

  function deposit(uint256 amount) external whenNotPaused nonReentrant {
    string memory tokenSymbol = getPaymentToken();

    require(_isTokenValid(tokenSymbol) && !_isNativeToken(tokenSymbol), "Payment token isn't valid token.");
    require(amount > 0, "Amount must be greater than 0.");

    bool success = IERC20(_tokenContractMap[tokenSymbol]).transferFrom(_msgSender(), address(this), amount);
    require(success, "Deposit failed.");

    _fundBalance += amount;
    _totalReceived += amount;
  }

  function deposit() external payable whenNotPaused nonReentrant {
    uint256 amount = msg.value;

    require(_isNativeToken(getPaymentToken()), "Payment token isn't native token.");
    require(amount > 0, "Amount must be greater than 0.");

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
