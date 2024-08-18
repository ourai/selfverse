import { readContract } from '../utils/contract';
import { updateContractAdmin } from './common';

const contractName = 'funds';

const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchBalance() {
  return readContract(contractName, 'getBalance');
}

async function fetchReceived() {
  return readContract(contractName, 'getReceived');
}

export { updateAdmin, fetchBalance, fetchReceived };
