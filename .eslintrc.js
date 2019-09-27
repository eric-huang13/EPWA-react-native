module.exports = {
  root: true,
  extends: '@react-native-community',
  "rules": {
    "quotes": ["warn", "double"],
    "comma-dangle": ["error", "never"],
    "react-native/no-inline-styles": 0,
    "array-callback-return": ["error", { allowImplicit: true }]
  }
};
