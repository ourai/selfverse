import { useAccount } from '@ant-design/web3';

function useIsAdmin() {
  const { account } = useAccount();

  return !!(account && account.address);
}

export { useIsAdmin };
