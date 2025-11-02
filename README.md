# SCM-UI

Reusable component library for Next.js applications built with TypeScript and Tailwind CSS.

## Installation

Install directly from GitHub:

```bash
npm install github:username/scm-ui
```

Or using other package managers:

```bash
# yarn
yarn add github:username/scm-ui

# pnpm
pnpm add github:username/scm-ui
```

## Setup

### 1. Configure Tailwind CSS

In your Next.js project, update your `tailwind.config.js` to use the SCM-UI preset:

```js
// tailwind.config.js
module.exports = {
  presets: [require('scm-ui/tailwind')],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add scm-ui components to content paths
    './node_modules/scm-ui/dist/**/*.{js,mjs}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. Import Styles (Optional)

If you need the global styles, import them in your root layout or `_app.tsx`:

```tsx
// app/layout.tsx (App Router)
import 'scm-ui/styles'

// or pages/_app.tsx (Pages Router)
import 'scm-ui/styles'
```

## Usage

Import components from the library:

```tsx
import { Button } from 'scm-ui'

export default function Page() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}
```

## Available Components

### Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
- `size`: `default` | `sm` | `lg` | `icon`

**Examples:**

```tsx
// Different variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Disabled state
<Button disabled>Disabled</Button>

// With custom className
<Button className="w-full">Full Width</Button>
```

## Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Available Scripts

```bash
# Development mode with watch
npm run dev

# Build the library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Type checking
npm run type-check
```

### Testing

Tests are written using Vitest and React Testing Library:

```bash
npm test
```

### Storybook

View and develop components in isolation:

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) in your browser.

## Adding New Components

1. Create a new component directory in `src/components/`
2. Add the component, tests, and stories
3. Export from `src/index.ts`
4. Update this README

Example structure:

```
src/components/YourComponent/
├── YourComponent.tsx
├── YourComponent.test.tsx
└── YourComponent.stories.tsx
```

## Project Structure

```
scm-ui/
├── .storybook/          # Storybook configuration
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # Global styles
│   ├── test/            # Test setup
│   ├── index.ts         # Main exports
│   └── tailwind.config.ts  # Tailwind preset
├── dist/                # Built files (generated)
├── package.json
├── tsconfig.json
├── tsup.config.ts       # Build configuration
├── vitest.config.ts     # Test configuration
└── README.md
```

## Technologies

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **tsup** - Build tool
- **Vitest** - Testing framework
- **Storybook** - Component development
- **class-variance-authority** - Variant handling
- **clsx & tailwind-merge** - Class name utilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
