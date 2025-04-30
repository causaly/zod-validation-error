// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    minWorkers: 1,
    maxWorkers: process.env.CI ? 1 : 4,
  },
});
