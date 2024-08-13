import { useState, useEffect, useContext } from 'react';
import { useAccount } from '@ant-design/web3';

import { fetchContractOwner, fetchContractAdmin } from '../../services/common';

import type { AccountIdentity } from './typing';
import { getDefaultIdentity } from './helper';
import IdentityContext from './Context';

function useIdentity(contract: string): AccountIdentity {
  const { account } = useAccount();
  const [owner, setOwner] = useState('');
  const [admin, setAdmin] = useState('');
  const [checked, setChecked] = useState(false);
  const address = (account && account.address) || '';

  useEffect(() => {
    if (!address || !contract || checked) {
      return;
    }

    Promise.all([fetchContractOwner(contract), fetchContractAdmin(contract)])
      .then(results => {
        setOwner(results[0]);
        setAdmin(results[1]);
      })
      .finally(() => setChecked(true));
  });

  return address ? {
    checked,
    owner: address === owner,
    admin: address === admin,
    visitor: address !== owner && address !== admin,
    address,
    adminAddress: admin,
  } : getDefaultIdentity();
}

function useIdentityContext() {
  return useContext(IdentityContext);
}

export { useIdentity, useIdentityContext };
