module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-case-declarations': 'off',
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        destructuredArrayIgnorePattern: '[A-Z]',
        ignoreRestSiblings: true,
      },
    ],
    'prettier/prettier': 'error',
  },
};
