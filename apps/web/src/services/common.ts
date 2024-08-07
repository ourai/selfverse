import { readContract, writeContract } from '../utils/contract';

async function fetchContractOwner(contract: string) {
  return readContract(contract, 'owner') as Promise<string>;
}

async function fetchContractAdmin(contract: string) {
  const role = await readContract(contract, 'SV_ADMIN');
  const count = await readContract(contract, 'getRoleMemberCount', [role]);

  return count !== 0n ? readContract(contract, 'getRoleMember', [role, 0]) as Promise<string> : '';
}

async function updateContractAdmin(contract: string, address: `0x${string}`) {
  return writeContract(contract, 'updateAdmin', [address]);
}

export { fetchContractOwner, fetchContractAdmin, updateContractAdmin };
