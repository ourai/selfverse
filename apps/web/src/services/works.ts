import { parseEther } from 'viem';

import type { AddressHash, WorkFormValue, WorkListItem } from '../types';
import { readContract, writeContract } from '../utils/contract';
import { updateContractAdmin } from './common';

type WorkId = number | bigint;

const contractName = 'paidWorks';

const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchList(operator?: AddressHash) {
  return readContract(contractName, 'getAllWorks', operator ? [operator] : []);
}

async function fetchOne(id: WorkId, operator?: AddressHash) {
  const list = (await fetchList(operator)) as WorkListItem[];

  return list.find(item => item.id === id);
}

async function fetchBuyerList(id: WorkId) {
  return readContract(contractName, 'getBuyers', [id]);
}

async function insertOne(value: WorkFormValue) {
  return await writeContract(contractName, 'add', [
    parseEther(`${value.price}`),
    value.badgeContract || '0x0000000000000000000000000000000000000000',
    value.title,
    value.cover,
    value.description,
    value.content || '',
  ])
}

async function listForSales(id: WorkId, listing?: boolean) {
  return writeContract(contractName, listing !== false ? 'sell' : 'unlist', [id]);
}

async function buyOne(id: WorkId, price: bigint) {
  return writeContract(contractName, 'buy', [id], price);
}

export {
  updateAdmin,
  fetchList, fetchOne, fetchBuyerList,
  insertOne, listForSales, buyOne,
};
