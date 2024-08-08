import { formatEther } from 'viem';

export function resolvePrice(price: bigint | number) {
  return `${formatEther(price as bigint)} ETH`;
}

export * from './config';
