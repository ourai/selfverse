// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { IERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface ISoulboundToken is IERC721Enumerable {
  function updateBaseURI(string calldata newTokenBaseURI) external;
}
