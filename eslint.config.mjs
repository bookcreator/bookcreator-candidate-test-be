import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  {
    files: ["**/*.spec.js"],
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },
    plugins: {
      jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },
  pluginJs.configs.recommended,
];
