import js       from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Ignore generated / dependency folders
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Project-wide rules for all TS / TSX source files
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any':               'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars':                ['error', { argsIgnorePattern: '^_' }],
      'no-console':                                       ['warn', { allow: ['warn', 'error'] }],
      'prefer-const':                                     'error',
      'eqeqeq':                                           ['error', 'always'],
    },
  },

  // Relax rules for test and E2E files
  {
    files: ['src/**/*.test.ts', 'e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
