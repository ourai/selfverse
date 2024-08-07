const { join: joinPath } = require('path');
const { existsSync, readdirSync } = require('fs');

const { isDirectory, readData, saveData, createAppScriptExecutor } = require('../helper');

function resolveAbiMap(sourceDirPath) {
  return readdirSync(sourceDirPath).reduce((prev, dirName) => {
    const dirPath = joinPath(sourceDirPath, dirName);

    if (dirName.startsWith('.') || dirName.startsWith('_') || !isDirectory(dirPath)) {
      return prev;
    }

    if (!dirName.endsWith('.sol')) {
      return { ...prev, ...resolveAbiMap(dirPath) };
    }

    const contractName = dirName.replace('.sol', '');

    return { ...prev, [contractName]: readData(joinPath(dirPath, `${contractName}.json`)).abi };
  }, {});
}

function copyChainArtifacts(appRoot) {
  const artifactRoot = joinPath(appRoot, '..', 'chain', 'artifacts', 'contracts');

  if (!existsSync(artifactRoot)) {
    return;
  }

  const contracts = resolveAbiMap(artifactRoot);

  if (Object.keys(contracts).length === 0) {
    return;
  }

  saveData(joinPath(appRoot, 'src', 'abis.ts'), `export default ${JSON.stringify(contracts, null, 2)};\n`);
}

module.exports = {
  execute: createAppScriptExecutor(({ app, appRoot, exec }) => {
    if (app === 'web') {
      copyChainArtifacts(appRoot);

      return exec('pnpm run dev');
    }

    if (app === 'chain') {
      return exec('pnpm start');
    }
  }),
};
