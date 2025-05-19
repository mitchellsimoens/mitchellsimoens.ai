// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y
    },
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/order': ['error', { 'alphabetize': { order: 'asc' } }],
      'prettier/prettier': 'error'
    }
  },
  prettier
];
