module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    quotes: ["error", "double"],
    "max-len": ["warn", { "code": 100 }],
    "no-console": "off", // We want to use console for logging
    "no-unused-vars": "warn",
  },
}; 