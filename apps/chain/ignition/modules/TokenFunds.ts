import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('TokenFunds', m => {
  return { funds: m.contract('TokenFunds', ['ETH']) };
});
