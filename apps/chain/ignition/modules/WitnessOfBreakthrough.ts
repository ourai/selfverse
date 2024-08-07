import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('WitnessOfBreakthrough', m => {
  return { witnessOfBreakthrough: m.contract('WitnessOfBreakthrough', ['']) };
});
