import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import TokenFunds from './TokenFunds';
import Donation from './Donation';

export default buildModule('Article', m => {
  const { funds } = m.useModule(TokenFunds);
  const { donation } = m.useModule(Donation);

  return { article: m.contract('Article', [funds, donation]) };
});
