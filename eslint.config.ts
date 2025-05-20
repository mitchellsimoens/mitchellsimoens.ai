import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

import coreConfigs from './.eslint/core';
import importPluginConfigs from './.eslint/eslint-plugin-import';
import reactConfigs from './.eslint/react';

export default tseslint.config([
  {
    ignores: ['**/node_modules/', '**/*.log', '**/*.env*', '**/.next/', '**/out/', '**/dist/'],
  },
  ...reactConfigs,
  ...importPluginConfigs,
  ...coreConfigs,
  eslintPluginPrettierRecommended,
]);
