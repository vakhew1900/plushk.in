import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';

// Layer names mirror CLAUDE.md's "Layer order (top-down only)":
// components/ -> hooks/ -> context/ -> services/ -> repository/ -> chrome.* / IndexedDB
const ElementType = {
  ENTRYPOINTS: 'entrypoints',
  COMPONENTS: 'components',
  HOOKS: 'hooks',
  CONTEXT: 'context',
  SERVICES: 'services',
  REPOSITORY: 'repository',
  DB: 'db',
  LIB: 'lib',
  TYPES: 'types',
};

export default tseslint.config(
  {
    ignores: ['.output/**', '.wxt/**', 'node_modules/**'],
  },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      boundaries,
    },
    settings: {
      'boundaries/include': ['**/*.ts', '**/*.tsx'],
      'boundaries/elements': [
        { type: ElementType.ENTRYPOINTS, pattern: 'entrypoints/**/*' },
        { type: ElementType.COMPONENTS, pattern: 'components/**/*' },
        { type: ElementType.HOOKS, pattern: 'hooks/**/*' },
        { type: ElementType.CONTEXT, pattern: 'context/**/*' },
        { type: ElementType.SERVICES, pattern: 'services/**/*' },
        { type: ElementType.REPOSITORY, pattern: 'repository/**/*' },
        { type: ElementType.DB, pattern: 'db/**/*' },
        { type: ElementType.LIB, pattern: 'lib/**/*' },
        { type: ElementType.TYPES, pattern: 'types/**/*' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Layer order is a load-bearing architecture decision (see CLAUDE.md
      // "Layer order (top-down only)") — enforce it instead of relying on
      // review to catch a stray import.
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ElementType.ENTRYPOINTS,
              allow: [
                ElementType.ENTRYPOINTS,
                ElementType.COMPONENTS,
                ElementType.HOOKS,
                ElementType.CONTEXT,
                ElementType.SERVICES,
                ElementType.LIB,
                ElementType.TYPES,
              ],
            },
            {
              from: ElementType.COMPONENTS,
              allow: [ElementType.COMPONENTS, ElementType.HOOKS, ElementType.CONTEXT, ElementType.LIB, ElementType.TYPES],
            },
            {
              from: ElementType.HOOKS,
              allow: [ElementType.HOOKS, ElementType.CONTEXT, ElementType.LIB, ElementType.TYPES],
            },
            {
              from: ElementType.CONTEXT,
              allow: [ElementType.CONTEXT, ElementType.SERVICES, ElementType.REPOSITORY, ElementType.LIB, ElementType.TYPES],
            },
            {
              from: ElementType.SERVICES,
              allow: [ElementType.SERVICES, ElementType.REPOSITORY, ElementType.LIB, ElementType.TYPES],
            },
            {
              from: ElementType.REPOSITORY,
              allow: [ElementType.REPOSITORY, ElementType.DB, ElementType.LIB, ElementType.TYPES],
            },
            { from: ElementType.DB, allow: [ElementType.DB, ElementType.LIB, ElementType.TYPES] },
            { from: ElementType.LIB, allow: [ElementType.LIB, ElementType.TYPES] },
            { from: ElementType.TYPES, allow: [ElementType.TYPES] },
          ],
        },
      ],

      // "`any` is forbidden. Use `unknown` + type guard for uncertain types."
      '@typescript-eslint/no-explicit-any': 'error',

      // "String constants use `as const` objects, never `enum`."
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Enums are forbidden — use an `as const` object + derived union type instead (see CLAUDE.md).',
        },
      ],

      // "All IndexedDB access goes through repository classes." Only the
      // repository layer is allowed to know Dexie exists.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'dexie',
              message: 'Dexie must only be used inside src/repository/ — go through a repository class instead.',
            },
          ],
        },
      ],

      // "Debug logging: use `debugLog`, never raw `console.log`." debug-log.ts
      // itself is the one file allowed to call console (see override below).
      'no-console': 'error',

      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // db/ is the Dexie schema itself; repository/ is the only *consumer*
    // layer allowed to reach into it.
    files: ['repository/**/*.ts', 'db/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['lib/debug-log.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // Mock implementations of async interface methods routinely have no
      // `await` in their body — that's the point of a mock.
      '@typescript-eslint/require-await': 'off',
      // JSON.parse/deep-clone helpers and loosely-typed assertion args are
      // routine in tests; the `any` boundary is intentional there.
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);
