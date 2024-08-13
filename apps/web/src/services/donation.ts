import type { AddressHash, DonationRecord } from '../types';
import { readContract, writeContract } from '../utils/contract';
import { updateContractAdmin } from './common';

const contractName = 'donation';

const updateAdmin = updateContractAdmin.bind(null, contractName);

async function fetchList(donator?: AddressHash) {
  return readContract(contractName, 'getDonations', donator ? [donator] : []) as Promise<DonationRecord[]>;
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

async function hasBadge(donator: AddressHash) {
  let badgeGot = false;

  try {
    await readContract(contractName, 'tokenOfOwnerByIndex', [donator, 0]);
    badgeGot = true;
  } catch (err) {
    console.log(`[ERROR] fetch badge of donator \`${donator}\``, err);
  }

  return badgeGot;
}

export { updateAdmin, fetchList, fetchDonatorList, fetchReceived, fetchMinted, donate, hasBadge };
