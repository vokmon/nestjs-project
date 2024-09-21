import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { loadEnvFile } from 'process';
import path from 'path';
import { configDefaults } from 'vitest/config';

const envFile = '.env.e2e.test';

loadEnvFile(path.resolve(__dirname, envFile));

export default defineConfig({
  test: {
    globals: true,
    root: './',
    env: loadEnv('test', envFile, ''),
    environment: 'node',
    include: ['**/*.e2e-spec.ts'],
    alias: {
      '@src': './src',
      '@test': './test',
    },
    coverage: {
      provider: 'v8',
      exclude: [
        ...configDefaults.coverage.exclude,
        '**/*.module.ts',
        '**/main.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@src': './src',
      '@test': './test',
    },
  },

  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'nodenext' },
    }),
  ],
});
