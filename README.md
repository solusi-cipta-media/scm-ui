# SCM-UI

Component library untuk Next.js dengan TypeScript dan Tailwind CSS.

## Installation

Install dari GitHub repository:

```bash
# npm
npm install github:solusi-cipta-media/scm-ui

# yarn
yarn add github:solusi-cipta-media/scm-ui

# pnpm
pnpm add github:solusi-cipta-media/scm-ui
```

## Setup

### 1. Tailwind Configuration

Update `tailwind.config.js` di project Anda:

```js
module.exports = {
  presets: [require('scm-ui/tailwind')],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Tambahkan path scm-ui components
    './node_modules/scm-ui/dist/**/*.{js,mjs}'
  ],
}
```

### 2. Peer Dependencies

Install required dependencies:

```bash
npm install @tanstack/react-query lucide-react
```

### 3. shadcn/ui Components (untuk DataTable)

DataTable component memerlukan shadcn/ui components. Install di project Anda:

```bash
npx shadcn@latest add table button input select
```

## Quick Start

```tsx
import { Button, DataTable } from 'scm-ui'

export default function Page() {
  return <Button>Click me</Button>
}
```

## Available Components

- **Button** - Versatile button dengan multiple variants
- **DataTable** - Server-side table dengan pagination, sorting, dan search (fully responsive)
- **AutoComplete** - Autocomplete input component
- **RemoteAutoComplete** - Autocomplete dengan remote data fetching

### Hooks

- **useDebounce** - Debounce hook untuk inputs

### Utils

- **cn** - Class name utility

## Documentation

📚 **Full documentation & examples tersedia di Storybook**

Untuk melihat dokumentasi lengkap:

```bash
# Clone repository
git clone git@github.com:solusi-cipta-media/scm-ui.git
cd scm-ui

# Install dependencies
npm install

# Run Storybook
npm run storybook
```

Storybook akan terbuka di [http://localhost:6006](http://localhost:6006)

## License

MIT
