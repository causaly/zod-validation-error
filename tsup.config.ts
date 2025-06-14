import { defineConfig } from 'tsup';

export default [
  defineConfig({
    entry: ['lib/v3/index.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'v3',
  }),
  defineConfig({
    entry: ['lib/v4/index.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'v4',
  }),
];
