export const DONATION_CONTRACT_ADDR = import.meta.env.VITE_DONATION_ADDR;
export const PAIDWORKS_CONTRACT_ADDR = import.meta.env.VITE_PAIDWORKS_ADDR;
export const WOBT_CONTRACT_ADDR = import.meta.env.VITE_WOBT_ADDR

export const works = Array.from(new Array(8)).map((_, i) => ({
  id: i + 1,
  title: `作品 ${i + 1}`,
  description: `作品 ${i + 1} 的介绍介绍介绍介绍作品 ${i + 1} 的介绍介绍介绍介绍作品 ${i + 1} 的介绍介绍介绍介绍`,
  cover: '',
  price: i,
  listing: i % 2 === 0,
}));
