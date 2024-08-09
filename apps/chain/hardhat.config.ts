import '@nomicfoundation/hardhat-toolbox';
import type { HardhatUserConfig } from 'hardhat/config';
import { config as confitDotEnv } from 'dotenv';

confitDotEnv({ path: ['.env.local', '.env'] });

const config: HardhatUserConfig = {
  defaultNetwork: 'localhost',
  solidity: '0.8.24',
  networks: {
    sepolia: {
      url: process.env.TESTNET_SEPOLIA_ENDPOINT_URL || '',
      accounts: [process.env.TESTNET_DEPLOY_ACCOUNT || ''],
    },
  },
};

export default config;
