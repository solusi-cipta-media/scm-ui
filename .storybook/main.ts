import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { fileURLToPath } from "url";

// Helper function to resolve paths relative
// SB_CORE-SERVER_0007 (MainFileEvaluationError): Storybook couldn't evaluate your .storybook\main.ts file.
const resolvePath = (relativePath: string) => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, relativePath);
};

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
          "@/components/ui/table": resolvePath("mocks/ui/table.tsx"),
          "@/components/ui/button": resolvePath("mocks/ui/button.tsx"),
          "@/components/ui/input": resolvePath("mocks/ui/input.tsx"),
          "@/components/ui/select": resolvePath("mocks/ui/select.tsx"),
          "@/components": resolvePath("../src/components"),
          "@/hooks": resolvePath("../src/hooks"),
          "@/utils": resolvePath("../src/utils"),
          "@/types": resolvePath("../src/types"),
          "@/styles": resolvePath("../src/styles"),
          "@": resolvePath("../src"),
        },
      },
    };
  },
};
export default config;
