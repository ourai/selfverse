import { readContract as readContractByWagmi, writeContract as writeContractByWagmi } from '@wagmi/core';

import type { AddressHash } from '../types';
import { PAIDWORKS_CONTRACT_ADDR, DONATION_CONTRACT_ADDR, WOBT_CONTRACT_ADDR } from '../constants';
import abis from '../abis';

import { getWagmiConfig } from './config';

const contracts: Record<string, { name: keyof typeof abis; addr: AddressHash }> = {
  paidWorks: {
    name: 'PaidWorks',
    addr: PAIDWORKS_CONTRACT_ADDR,
  },
  donation: {
    name: 'Donation',
    addr: DONATION_CONTRACT_ADDR,
  },
  wobt: {
    name: 'WitnessOfBreakthrough',
    addr: WOBT_CONTRACT_ADDR,
  },
};

async function readContract(contract: string, functionName: string, args?: any[]) {
  const { name, addr } = contracts[contract];

  return readContractByWagmi(getWagmiConfig() as any, { address: addr, abi: abis[name], functionName, args });
}

async function writeContract(contract: string, functionName: string, args?: any[], value?: any) {
  const { name, addr } = contracts[contract];

  return writeContractByWagmi(getWagmiConfig() as any, { address: addr, abi: abis[name], functionName, args, value });
}

export { readContract, writeContract };
