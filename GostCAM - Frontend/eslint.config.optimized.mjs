// =============================================
// ESLINT CONFIGURATION OPTIMIZADA
// =============================================

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/*.js.map",
      "**/*.css.map",
      "public/**",
      ".vscode/**",
      "*.config.js"
    ],
    rules: {
      // TypeScript específico
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/prefer-const": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // React específico
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "error",
      "react/jsx-key": "error",
      "react/no-array-index-key": "warn",

      // Performance y buenas prácticas
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",
      "prefer-const": "error",
      "no-var": "error",

      // Importaciones
      "import/no-duplicates": "error",
      "import/order": ["error", {
        "groups": [
          "builtin",
          "external", 
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],

      // Prevenir memory leaks
      "react-hooks/rules-of-hooks": "error"
    },
    settings: {
      "import/resolver": {
        "typescript": {
          "alwaysTryTypes": true,
          "project": "./tsconfig.json"
        }
      }
    }
  },
  // Configuración específica para archivos de prueba
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  // Configuración para archivos de configuración
  {
    files: ["*.config.{js,ts,mjs}", "next.config.js"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off"
    }
  }
];

export default eslintConfig;