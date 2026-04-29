const js = require("@eslint/js");
const nextPlugin = require("@next/eslint-plugin-next");
const tseslint = require("typescript-eslint");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "eslint.config.*",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...(nextPlugin.configs.recommended?.rules ?? {}),
      ...(nextPlugin.configs["core-web-vitals"]?.rules ?? {}),
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

