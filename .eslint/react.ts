import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import react from 'eslint-plugin-react';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const configs = [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { react },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  ...compat.config({
    extends: ['next', 'next/core-web-vitals', 'next/typescript'],
  }),
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
];

export default configs;
