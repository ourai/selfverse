const { join: joinPath } = require('path');
const { existsSync, readdirSync } = require('fs');

const { isDirectory, createAppScriptExecutor } = require('../helper');

module.exports = {
  execute: createAppScriptExecutor(({ app, appRoot, exec }, ...args) => {
    if (app !== 'chain') {
      return;
    }

    const [moduleName, networkName, needReset] = args;
    const modules = [];

    if (moduleName) {
      modules.push(moduleName);
    } else {
      const ignitionModuleDirPath = joinPath(appRoot, 'ignition/modules');

      readdirSync(ignitionModuleDirPath).forEach(dirName => {
        if (!dirName.startsWith('.') && dirName.endsWith('.ts') && !isDirectory(joinPath(ignitionModuleDirPath, dirName))) {
          modules.push(dirName.replace(/\.ts$/, ''));
        }
      });
    }

    return modules.forEach(m => {
      const moduleRelativePath = `./ignition/modules/${m}.ts`;

      if (!existsSync(joinPath(appRoot, moduleRelativePath))) {
        return;
      }

      const cmds = ['pnpm run deploy', `"${moduleRelativePath}"`];

      if (networkName) {
        cmds.push(`--network ${networkName}`);
      }

      if (needReset) {
        cmds.push('--reset');
      }

      exec(cmds.join(' '));
    });
  }, 'chain'),
};
