import withNuxt from './.nuxt/eslint.config.mjs';
import stylistic from '@stylistic/eslint-plugin';

export default withNuxt(
  {
    plugins: {
      '@stylistic': stylistic,
    },
  },
  {
    ignores: ['.nuxt/**', '.output/**', 'build/**', 'dist/**', 'node_modules/**'],
  },
  {
    rules: {
      'no-nested-ternary': 'error',
      'no-dupe-else-if': 'error',
      curly: 'error',
      'no-lonely-if': 'error',
      'prefer-regex-literals': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-await-in-loop': 'warn',
      'no-prototype-builtins': 'error',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/semi': ['error', 'always'],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
);
