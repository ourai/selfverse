import type { AccountIdentity } from './typing';

const defaultIdentity: AccountIdentity = {
  checked: false,
  owner: false,
  admin: false,
  visitor: false,
  address: '',
  adminAddress: '',
};

function getDefaultIdentity() {
  return { ...defaultIdentity };
}

function resolveContract(pathname: string) {
  if (pathname.startsWith('/cellar/funds')) {
    return 'funds';
  }

  if (pathname.startsWith('/donation') || pathname.startsWith('/cellar/donation')) {
    return 'donation';
  }

  if (pathname.startsWith('/cellar/articles')) {
    return 'article';
  }

  if (pathname.startsWith('/works') || pathname.startsWith('/cellar/works')) {
    return 'paidWorks';
  }

  return 'article';
}

export { getDefaultIdentity, resolveContract };
