import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'lib/index.ts',
    'v4/index': 'lib/v4/index.ts',
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
});
