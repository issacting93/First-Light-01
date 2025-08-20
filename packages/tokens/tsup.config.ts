import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tailwind.preset.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['tailwindcss'],
  outDir: 'dist',
  loader: {
    '.css': 'copy'
  },
  onSuccess: 'cp src/styles.css dist/'
}); 