'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'ember/no-actions-hash': 'off',
    'ember/no-arrow-function-computed-properties': 'off',
    'ember/no-classic-classes': 'off',
    'ember/no-classic-components': 'off',
    'ember/no-computed-properties-in-native-classes': 'off',
    'ember/no-get': 'off',
    'ember/no-new-mixins': 'off',
    'ember/no-volatile-computed-properties': 'off',
    'ember/require-computed-property-dependencies': 'off',
    'ember/require-return-from-computed': 'off',
    'ember/require-tagless-components': 'off',
    'ember/use-ember-data-rfc-395-imports': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
      rules: {
        'qunit/no-conditional-assertions': 'off',
        'qunit/require-expect': 'off',
      },
    },
  ],
};
