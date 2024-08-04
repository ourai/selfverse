import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('Donation', m => {
  return { donation: m.contract('Donation') };
});
