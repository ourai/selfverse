// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

abstract contract IncreasableToken {
  uint256 private _tokenIdCounter;

  function _currentTokenId() internal view returns (uint256) {
    return _tokenIdCounter;
  }

  function _nextTokenId() internal view returns (uint256) {
    return _currentTokenId() + 1;
  }

  function _increaseTokenId() internal returns (uint256) {
    _tokenIdCounter += 1;
    return _currentTokenId();
  }
}
