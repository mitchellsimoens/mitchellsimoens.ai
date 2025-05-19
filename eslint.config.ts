import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';

import coreConfigs from './.eslint/core';
import importPluginConfigs from './.eslint/eslint-plugin-import';
import reactConfigs from './.eslint/react';

export default tseslint.config([
  { ignores: ['node_modules/', 'dist/', '*.log', '.env', '.next/', 'out/'] },
  ...reactConfigs,
  ...importPluginConfigs,
  ...coreConfigs,
  eslintPluginPrettierRecommended,
]);
