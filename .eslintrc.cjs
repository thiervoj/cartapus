/* eslint-disable */
const standard = require('eslint-config-standard')

module.exports = {
  ...standard,
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "space-before-function-paren": "off"
  }
}
