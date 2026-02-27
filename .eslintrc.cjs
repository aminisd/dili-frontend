module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Hard failures
    'no-unused-vars': 'error',
    'no-console': 'error',

    // React / TS hygiene
    'react/jsx-no-undef': 'error',
    '@next/next/no-html-link-for-pages': 'error',
  },
};
