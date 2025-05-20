/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-expect-error
import importPlugin from 'eslint-plugin-import';
// @ts-expect-error
import importPluginErrors from 'eslint-plugin-import/config/flat/errors';
// @ts-expect-error
import importPluginReact from 'eslint-plugin-import/config/flat/react';
// @ts-expect-error
import importPluginRecommended from 'eslint-plugin-import/config/flat/recommended';

const configs = [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { import: importPlugin },
    rules: {
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          named: true,
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '$/*',
              group: 'internal',
              position: 'before',
            },
          ],
        },
      ],
    },
  },
  importPluginErrors,
  {
    ...importPluginReact,
    settings: {
      'import/extensions': [...importPlugin.configs.typescript.settings['import/extensions']],
    },
  },
  importPluginRecommended,
  importPlugin.configs.typescript,
];

export default configs;
