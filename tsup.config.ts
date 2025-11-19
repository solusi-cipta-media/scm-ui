import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@/components/ui/button',
    '@/components/ui/input',
    '@/components/ui/select',
    '@/components/ui/table',
  ],
  treeshake: true,
  minify: false,
  // Inject CSS into the bundle
  injectStyle: false,
  // Copy globals.css to dist for consumers
  onSuccess: 'cp src/styles/globals.css dist/globals.css && echo "Build completed successfully"'
})
