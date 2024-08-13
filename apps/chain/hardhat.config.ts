import '@nomicfoundation/hardhat-toolbox';
import type { HardhatUserConfig } from 'hardhat/config';
import { config as confitDotEnv } from 'dotenv';

confitDotEnv({ path: ['.env.local', '.env'] });

const { TESTNET_SEPOLIA_ENDPOINT_URL, TESTNET_DEPLOY_ACCOUNT } = process.env;
const networks: HardhatUserConfig['networks'] = {};

if (TESTNET_SEPOLIA_ENDPOINT_URL && TESTNET_DEPLOY_ACCOUNT) {
  networks.sepolia = {
    url: TESTNET_SEPOLIA_ENDPOINT_URL,
    accounts: [TESTNET_DEPLOY_ACCOUNT],
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: 'localhost',
  solidity: '0.8.24',
  networks,
};

export default config;
