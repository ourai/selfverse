import type { Chain, Transport } from 'viem';
import { createConfig, http } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';

function isHardhatEnabled() {
  return ['true', true].indexOf(import.meta.env.VITE_HARDHAT_ENABLED) !== -1;
}

const chains: Chain[] = [];
const transports: Record<number, Transport> = {};

if (isHardhatEnabled()) {
  chains.push(hardhat);
  transports[hardhat.id] = http();
} else {
  chains.push(sepolia);
  transports[sepolia.id] = http();
}

const wagmiConfig = createConfig({ chains: chains as [Chain, ...Chain[]], transports });

function getWagmiConfig() {
  return wagmiConfig;
}

export { isHardhatEnabled, getWagmiConfig };
