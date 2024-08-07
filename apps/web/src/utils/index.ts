export function isHardhatEnabled() {
  return ['true', true].indexOf(import.meta.env.VITE_HARDHAT_ENABLED) !== -1;
}

export function resolvePrice(price: number) {
  return `${price} ETH`;
}
