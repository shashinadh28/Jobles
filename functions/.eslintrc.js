module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-console": "off", // We want to use console for logging
    "no-unused-vars": "warn",
  },
}; 