import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { formatEther } from 'viem';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatUnixDate(timestamp: bigint, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(Number(timestamp) * 1000).tz('Asia/Shanghai').format(format);
}

export function resolvePrice(price: bigint | number) {
  return `${formatEther(price as bigint)} ETH`;
}

export * from './config';
