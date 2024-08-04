// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import { AchievementToken } from "./AchievementToken.sol";

contract WitnessOfBreakthrough is AchievementToken {
  constructor(string memory tokenBaseURI)
    AchievementToken("Selfverse Witness Of Breakthrough", "SV-WOBT", tokenBaseURI)
  {}
}
