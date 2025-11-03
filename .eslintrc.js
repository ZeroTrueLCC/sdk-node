module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // TypeScript - keep only essential rules (80/20 principle)
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    
    // General - minimal rules
    'no-console': 'off', // Allow console for SDK
    'no-debugger': 'error',
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.ts', 'examples'],
};
