module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    '@feature-sliced',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    quotes: ['error', 'double'],
    semi: ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-nested-ternary': 'error',
  },
};
