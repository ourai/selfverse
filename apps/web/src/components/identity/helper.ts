import type { AccountIdentity } from './typing';

const defaultIdentity: AccountIdentity = {
  checked: false,
  owner: false,
  admin: false,
  visitor: false,
};

function getDefaultIdentity() {
  return { ...defaultIdentity };
}

function resolveContract(pathname: string) {
  if (pathname.startsWith('/works')) {
    return 'paidWorks';
  }

  return '';
}

export { getDefaultIdentity, resolveContract };
