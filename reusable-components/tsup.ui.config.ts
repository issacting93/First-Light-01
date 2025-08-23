import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/ui/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist/ui',
});
