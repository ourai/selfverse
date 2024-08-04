import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('PaidWorks', m => {
  return { paidWorks: m.contract('PaidWorks') };
});
