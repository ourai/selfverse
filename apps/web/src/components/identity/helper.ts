import type { AccountIdentity } from './typing';

const defaultIdentity: AccountIdentity = {
  checked: false,
  owner: false,
  admin: false,
  visitor: false,
  adminAddress: '',
};

function getDefaultIdentity() {
  return { ...defaultIdentity };
}

function resolveContract(pathname: string) {
  if (pathname.startsWith('/works') || pathname.startsWith('/cellar/works')) {
    return 'paidWorks';
  }

  if (pathname.startsWith('/donation') || pathname.startsWith('/cellar/donation')) {
    return 'donation';
  }

  return '';
}

export { getDefaultIdentity, resolveContract };
