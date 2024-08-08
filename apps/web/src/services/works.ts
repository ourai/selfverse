import { parseEther } from 'viem';

import type { WorkFormValue, WorkListItem } from '../types';
import { readContract, writeContract } from '../utils/contract';
import { fetchContractOwner, fetchContractAdmin, updateContractAdmin } from './common';

const contractName = 'paidWorks';

const fetchOwner = fetchContractOwner.bind(null, contractName);
const fetchAdmin = fetchContractAdmin.bind(null, contractName);
const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchList() {
  return readContract(contractName, 'getAllWorks');
}

async function fetchOne(id: number | bigint) {
  const list = (await fetchList()) as WorkListItem[];

  return list.find(item => item.id === id);
}

async function insertOne(value: WorkFormValue) {
  return await writeContract(contractName, 'add', [
    parseEther(`${value.price}`),
    value.badgeContract,
    value.title,
    value.cover,
    value.description,
    value.content || '',
  ])
}

async function listForSales(id: number | bigint, listing?: boolean) {
  return writeContract(contractName, listing !== false ? 'sell' : 'unlist', [id]);
}

export { fetchOwner, fetchAdmin, updateAdmin, fetchList, fetchOne, insertOne, listForSales };
