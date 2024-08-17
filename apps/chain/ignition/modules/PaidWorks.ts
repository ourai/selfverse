import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import TokenFunds from './TokenFunds';

export default buildModule('PaidWorks', m => {
  const { funds } = m.useModule(TokenFunds);

  return { paidWorks: m.contract('PaidWorks', [funds]) };
});
