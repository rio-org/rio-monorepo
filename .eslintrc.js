// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  rules: {
    '@next/next/no-html-link-for-pages': [
      'error',
      path.join(__dirname, 'packages/frontend')
    ],
    '@typescript-eslint/no-unsafe-argument': [
      'off',
      path.join(__dirname, 'packages/sdk'),
      path.join(__dirname, 'packages/ui')
    ],
    '@typescript-eslint/no-misused-promises': [
      'off',
      path.join(__dirname, 'packages/bot')
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off'
  },
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  }
};
