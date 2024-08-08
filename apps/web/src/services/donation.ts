import { readContract, writeContract } from '../utils/contract';
import { updateContractAdmin } from './common';

const contractName = 'donation';

const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchList() {
  return readContract(contractName, 'getDonations');
}

async function fetchDonatorList() {
  return readContract(contractName, 'getDonators');
}

async function fetchReceived() {
  return readContract(contractName, 'getReceived');
}

async function fetchMinted() {
  return readContract(contractName, 'totalSupply');
}

async function donate(value: bigint) {
  return writeContract(contractName, 'donate', [], value);
}

export { updateAdmin, fetchList, fetchDonatorList, fetchReceived, fetchMinted, donate };
