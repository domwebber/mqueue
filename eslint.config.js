import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginUnicorn.configs.all,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "formatjs/no-offset": "error",
      "formatjs/enforce-description": "warn",

      // "unicorn/prefer-top-level-await": "off",
      "unicorn/filename-case": "off",
      "unicorn/custom-error-definition": "off",
    },
  },
  tseslint.configs.recommended,
  globalIgnores(["**/__generated/**", "**/dist/**", "**/coverage/**"]),
]);
