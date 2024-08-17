import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import TokenFunds from './TokenFunds';

export default buildModule('Donation', m => {
  const { funds } = m.useModule(TokenFunds);

  return { donation: m.contract('Donation', [funds, '']) };
});
