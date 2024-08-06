import type { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';
import { WagmiWeb3ConfigProvider, MetaMask, OkxWallet, Sepolia, Hardhat } from '@ant-design/web3-wagmi';
import { createConfig, http } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';

const config = createConfig({
  chains: [sepolia, hardhat],
  transports: {
    [sepolia.id]: http(),
    [hardhat.id]: http()
  }
});

function Container(props: PropsWithChildren) {
  return (
    <ConfigProvider button={{ autoInsertSpace: false }}>
      <WagmiWeb3ConfigProvider
        config={config}
        chains={[Sepolia, Hardhat]}
        wallets={[MetaMask(), OkxWallet()]}
        eip6963={{ autoAddInjectedWallets: true }}
      >
        {props.children}
      </WagmiWeb3ConfigProvider>
    </ConfigProvider>
  )
}

export default Container;
