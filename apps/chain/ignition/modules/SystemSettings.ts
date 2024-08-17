import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import TokenFunds from './TokenFunds';
import Donation from './Donation';
import Article from './Article';
import PaidWorks from './PaidWorks';

export default buildModule('SystemSettings', m => {
  const { funds } = m.useModule(TokenFunds);
  const { donation } = m.useModule(Donation);
  const { article } = m.useModule(Article);
  const { paidWorks } = m.useModule(PaidWorks);

  return { settings: m.contract('SystemSettings', [funds, [
    { key: 'donation', contractAddr: donation },
    { key: 'article', contractAddr: article },
    { key: 'works', contractAddr: paidWorks },
  ]]) };
});
