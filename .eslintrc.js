module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended",
    "plugin:react-hooks",
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  rules: {
    "indent": ["error", 2],
    "linebreak-style": ["error", "windows"],
    "jsx-a11y/media-has-caption": "off",
    "max-len": ["error", { "code": 120 }],
    "no-console": "off",
    "no-case-declarations": "off",
    "no-cond-assign": ["error", "except-parens"],
    "react/jsx-filename-extension": [0],
    "react/forbid-prop-types": [
      "error",
      {
        "forbid": ["any"]
      }
    ],
    "react/require-default-props": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  settings: {
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  }
};