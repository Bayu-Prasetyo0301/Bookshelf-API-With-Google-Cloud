import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module', // Ensure support for ES Modules
    },
    rules: {
      'no-console': 'warn', // Optional: allows console logs with a warning
      'import/prefer-default-export': 'off', // Optional: allow named exports
    },
  },
  {
    languageOptions: {
      globals: globals.node, // Node.js globals
    },
    plugins: ['import'], // Optional: enable import plugin
    extends: [
      'airbnb-base', // Extend Airbnb's base configuration
    ],
  },
  pluginJs.configs.recommended, // Use the recommended rules from eslint-plugin-js
];
