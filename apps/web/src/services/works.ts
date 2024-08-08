import { parseEther } from 'viem';

import type { WorkFormValue } from '../types';
import { readContract, writeContract } from '../utils/contract';
import { fetchContractOwner, fetchContractAdmin, updateContractAdmin } from './common';

const contractName = 'paidWorks';

const fetchOwner = fetchContractOwner.bind(null, contractName);
const fetchAdmin = fetchContractAdmin.bind(null, contractName);
const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchList() {
  return readContract(contractName, 'getAllWorks');
}

async function insertOne({ price, badgeContract, ...others }: WorkFormValue) {
  const args: [bigint, string?] = [parseEther(`${price}`)];

  if (badgeContract) {
    args.push(badgeContract);
  }

  const id = await writeContract(contractName, 'add', args);

  await writeContract(contractName, 'updateMetadata', [
    id,
    others.title,
    others.cover,
    others.description,
    others.content || '',
  ])
}

export { fetchOwner, fetchAdmin, updateAdmin, fetchList, insertOne };
