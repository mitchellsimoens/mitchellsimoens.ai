import js from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { configs as tseslintConfigs, parser } from 'typescript-eslint';

const configs = [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: { js },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

          bun: true,
        }),
      ],
    },
  },
  js.configs.recommended,
  ...tseslintConfigs.recommended,
  ...tseslintConfigs.stylistic,
];

export default configs;
