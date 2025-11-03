import type { StorybookConfig } from "@storybook/react-vite";
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@/components/ui/table': path.resolve(__dirname, 'mocks/ui/table.tsx'),
          '@/components/ui/button': path.resolve(__dirname, 'mocks/ui/button.tsx'),
          '@/components/ui/input': path.resolve(__dirname, 'mocks/ui/input.tsx'),
          '@/components/ui/select': path.resolve(__dirname, 'mocks/ui/select.tsx'),
          '@/components': path.resolve(__dirname, '../src/components'),
          '@/hooks': path.resolve(__dirname, '../src/hooks'),
          '@/utils': path.resolve(__dirname, '../src/utils'),
          '@/types': path.resolve(__dirname, '../src/types'),
          '@/styles': path.resolve(__dirname, '../src/styles'),
          '@': path.resolve(__dirname, '../src'),
        },
      },
    }
  },
};
export default config;
