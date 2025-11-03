import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  outDir: 'dist',
  target: 'es2020',
  platform: 'node',
  external: ['axios', 'form-data'],
  // Proper CommonJS interop for default export
  cjsInterop: true,
});
