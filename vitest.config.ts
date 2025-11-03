import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'tests/**',
        'examples/**',
        '**/*.config.ts',
        '**/*.config.js',
        '.eslintrc.js',
        'dist/**',
        'node_modules/**',
      ],
      thresholds: {
        lines: 60,
        functions: 45,
        branches: 85,
        statements: 60,
      },
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
});
