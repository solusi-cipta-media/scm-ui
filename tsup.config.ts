import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tailwind.config': 'src/tailwind.config.ts'
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
    // Mark UI components as external (to be provided by consuming project)
    '@/components/ui/table',
    '@/components/ui/button',
    '@/components/ui/input',
    '@/components/ui/select',
  ],
  treeshake: true,
  minify: false,
  // Inject CSS into the bundle
  injectStyle: false,
  // Copy styles to dist
  onSuccess: 'echo "Build completed successfully"'
})
