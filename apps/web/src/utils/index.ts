import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatEther } from 'viem';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

function resolveUnixDate(timestamp: bigint) {
  return dayjs(Number(timestamp) * 1000).tz('Asia/Shanghai');
}

export function formatUnixDate(timestamp: bigint, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return resolveUnixDate(timestamp).format(format);
}

export function resolveRelativeTime(timestamp: bigint) {
  return resolveUnixDate(timestamp).fromNow();
}

export function resolvePrice(price: bigint | number) {
  return `${formatEther(price as bigint)} ETH`;
}

export * from './config';
