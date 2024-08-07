import type { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';
import { WagmiWeb3ConfigProvider, MetaMask, OkxWallet, Sepolia, Hardhat } from '@ant-design/web3-wagmi';

import { isHardhatEnabled, getWagmiConfig } from '../../utils';

function Container(props: PropsWithChildren) {
  return (
    <ConfigProvider button={{ autoInsertSpace: false }}>
      <WagmiWeb3ConfigProvider
        config={getWagmiConfig()}
        chains={[isHardhatEnabled() ? Hardhat : Sepolia]}
        wallets={[MetaMask(), OkxWallet()]}
        eip6963={{ autoAddInjectedWallets: true }}
      >
        {props.children}
      </WagmiWeb3ConfigProvider>
    </ConfigProvider>
  )
}

export default Container;
