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

export { updateAdmin, fetchList, fetchAll, insertOne, publish };
