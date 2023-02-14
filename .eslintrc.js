module.exports = {
  plugins: [
    "security"
  ],
  extends: [
    "plugin:security/recommended"
  ],
  rules: {
    "no-parsing-error": "off",
  },
};
