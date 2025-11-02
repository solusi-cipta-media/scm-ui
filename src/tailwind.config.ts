import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS preset for scm-ui component library
 * Import this preset in your consuming project's tailwind.config.js
 *
 * Example usage:
 * ```js
 * // tailwind.config.js
 * module.exports = {
 *   presets: [require('scm-ui/tailwind')],
 *   content: [
 *     './src/**\/*.{js,ts,jsx,tsx,mdx}',
 *     './node_modules/scm-ui/dist/**\/*.{js,mjs}'
 *   ],
 * }
 * ```
 */
const scmUIPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
}

export default scmUIPreset
