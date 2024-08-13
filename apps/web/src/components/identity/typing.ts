import type { PropsWithChildren } from 'react';

type AccountIdentity = {
  checked: boolean;
  owner: boolean;
  admin: boolean;
  visitor: boolean;
  address: string;
  adminAddress: string;
};

type IdentityProps = PropsWithChildren;

export type { AccountIdentity, IdentityProps };
