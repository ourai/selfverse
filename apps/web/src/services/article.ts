import type { ArticleFormValue, ArticleListItem } from '../types';
import { readContract, writeContract } from '../utils/contract';
import { updateContractAdmin } from './common';

type ArticleId = number | bigint;

const contractName = 'article';

const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchList() {
  return readContract(contractName, 'getList') as Promise<ArticleListItem[]>;
}

async function fetchAll() {
  return readContract(contractName, 'getAll') as Promise<ArticleListItem[]>;
}

async function fetchOne(id: ArticleId) {
  return readContract(contractName, 'getOne', [id]) as Promise<ArticleListItem>;
}

async function insertOne(value: ArticleFormValue) {
  return writeContract(contractName, 'add', [
    value.title,
    value.description,
    value.content,
    value.banner,
  ]);
}

async function publish(id: ArticleId, published?: boolean) {
  return writeContract(contractName, published !== false ? 'publish' : 'unpublish', [id]);
}

async function donate(id: ArticleId, value: bigint) {
  return writeContract(contractName, 'donate', [id], value);
}

export {
  updateAdmin,
  fetchList, fetchAll, fetchOne,
  insertOne, publish, donate,
};
