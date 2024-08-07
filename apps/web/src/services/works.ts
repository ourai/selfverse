import { readContract } from '../utils/contract';
import { fetchContractOwner, fetchContractAdmin, updateContractAdmin } from './common';

const contractName = 'paidWorks';

const fetchOwner = fetchContractOwner.bind(null, contractName);
const fetchAdmin = fetchContractAdmin.bind(null, contractName);
const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchList() {
  return readContract(contractName, 'getAllWorks');
}

export { fetchOwner, fetchAdmin, updateAdmin, fetchList };
