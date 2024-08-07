import type { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';
import { WagmiWeb3ConfigProvider, MetaMask, OkxWallet, Sepolia, Hardhat } from '@ant-design/web3-wagmi';
import type { Chain as AntdChain } from '@ant-design/web3';
import type { Chain, Transport } from 'viem';
import { createConfig, http } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';

import { isHardhatEnabled } from '../../utils';

const chainsProps: AntdChain[] = [Sepolia];
const chains: [Chain, ...Chain[]] = [sepolia];
const transports: Record<number, Transport> = { [sepolia.id]: http() };

if (isHardhatEnabled()) {
  chainsProps.push(Hardhat);
  chains.push(hardhat);
  transports[hardhat.id] = http();
}

const config = createConfig({ chains, transports });

function Container(props: PropsWithChildren) {
  return (
    <ConfigProvider button={{ autoInsertSpace: false }}>
      <WagmiWeb3ConfigProvider
        config={config}
        chains={chainsProps}
        wallets={[MetaMask(), OkxWallet()]}
        eip6963={{ autoAddInjectedWallets: true }}
      >
        {props.children}
      </WagmiWeb3ConfigProvider>
    </ConfigProvider>
  )
}

export default Container;
