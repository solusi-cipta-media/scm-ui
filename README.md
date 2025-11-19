# SCM-UI

Component library untuk Next.js dengan TypeScript dan Tailwind CSS.

---

## 📦 Installation (untuk Consumer/User)

> **Section ini untuk Anda yang ingin menggunakan scm-ui di project Anda.**

## Installation

### 1. Install scm-ui Package

```bash
# npm
npm install github:solusi-cipta-media/scm-ui

# yarn
yarn add github:solusi-cipta-media/scm-ui

# pnpm
pnpm add github:solusi-cipta-media/scm-ui
```

### 2. Install Peer Dependencies

Install dependencies yang diperlukan oleh scm-ui:

```bash
# npm
npm install \
  tailwindcss@^4.0.0 \
  @tanstack/react-query@^5.0.0 \
  lucide-react@latest \
  @radix-ui/react-icons@latest \
  @radix-ui/react-popover@latest \
  @radix-ui/react-select@latest \
  @radix-ui/react-slot@latest

# yarn
yarn add \
  tailwindcss@^4.0.0 \
  @tanstack/react-query@^5.0.0 \
  lucide-react@latest \
  @radix-ui/react-icons@latest \
  @radix-ui/react-popover@latest \
  @radix-ui/react-select@latest \
  @radix-ui/react-slot@latest

# pnpm
pnpm add \
  tailwindcss@^4.0.0 \
  @tanstack/react-query@^5.0.0 \
  lucide-react@latest \
  @radix-ui/react-icons@latest \
  @radix-ui/react-popover@latest \
  @radix-ui/react-select@latest \
  @radix-ui/react-slot@latest
```

**Note:** Menggunakan `@latest` untuk radix-ui dan lucide-react memastikan compatibility dengan versions terbaru.

**Catatan:** Jika project Anda sudah menggunakan shadcn/ui, kemungkinan besar packages ini sudah terinstall. Anda bisa skip packages yang sudah ada atau check dengan `npm list <package-name>`.

### 3. Install Required shadcn/ui Components

scm-ui menggunakan shadcn components dari **project Anda**, jadi tidak ada bundled CSS. Install components yang diperlukan:

```bash
npx shadcn@latest add button input select table
```

**Penting:** scm-ui akan menggunakan **versi customized Anda** dari components ini, jadi DataTable dan components lainnya akan otomatis match dengan design system app Anda.

Jika Anda belum setup shadcn/ui, jalankan init terlebih dahulu:

```bash
npx shadcn@latest init
```

---

## ⚡ Quick Setup (Already Have Tailwind v4 + shadcn)

> **RECOMMENDED:** Jika project Anda sudah menggunakan Tailwind v4 dan shadcn/ui, setup sangat simple!

### 1. Update Tailwind Content Path

Tambahkan scm-ui path ke **existing** `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',     // your existing paths
    './app/**/*.{js,ts,jsx,tsx,mdx}',     // your existing paths
    './node_modules/scm-ui/dist/**/*.{js,mjs}'  // ← ADD THIS LINE
  ],
  // ... rest of your existing config (theme, plugins, etc)
}
```

### 2. Restart Development Server

```bash
npm run dev
```

**That's it!** ✅ scm-ui akan menggunakan Tailwind config dan shadcn components Anda yang sudah ada.

---

## 📚 Full Setup (New Tailwind v4 Project)

> Jika Anda **belum** setup Tailwind v4 atau shadcn/ui, ikuti langkah lengkap berikut:

### 1. Import Styles (Optional - Skip if Already Have Tailwind)

**Kapan perlu import `scm-ui/styles`?**
- ❌ **SKIP** jika sudah punya `@import 'tailwindcss'` dan `@theme` di CSS Anda
- ✅ **IMPORT** jika belum setup Tailwind v4 sama sekali

Jika perlu import, tambahkan di `app/globals.css`:

```css
@import 'scm-ui/styles';  /* Contains default @theme */
@import 'tailwindcss';
```

**Note:** `scm-ui/styles` berisi default @theme configuration. Jika Anda sudah punya @theme customization sendiri, **skip import ini**.

### 2. Configure Tailwind

Buat/update `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // WAJIB: Scan scm-ui components
    './node_modules/scm-ui/dist/**/*.{js,mjs}'
  ],
  theme: {
    extend: {
      colors: {
        // Customize sesuai brand Anda
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
    },
  },
}
```

### 3. Configure PostCSS

Buat `postcss.config.js`:

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 4. Configure TypeScript Path Alias

Pastikan `tsconfig.json` include path alias:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Note:** Path alias `@/*` diperlukan agar scm-ui dapat menemukan shadcn components Anda.

---

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

## Troubleshooting

### Module not found: Cannot resolve '@/components/ui/...'

**Masalah:** Error `Cannot find module '@/components/ui/button'` atau similar.

**Solusi:**
1. Pastikan Anda sudah install shadcn components: `npx shadcn@latest add button input select table`
2. Verify `tsconfig.json` punya path alias `@/*` yang pointing ke `./src/*`
3. Pastikan components ada di `src/components/ui/` directory
4. Restart development server

### Spacing tidak berfungsi

**Masalah:** Spacing classes (gap, padding, margin) tidak ter-apply pada components.

**Solusi:**
1. Pastikan Tailwind config Anda include path `./node_modules/scm-ui/dist/**/*.{js,mjs}` di `content` array
2. Restart development server setelah mengubah Tailwind config

**Note:** Tidak perlu import `scm-ui/styles` jika Anda sudah punya Tailwind configured!

### Styles import conflict / Duplicate @import

**Masalah:** Error terkait duplicate `@import 'tailwindcss'` atau conflict dengan existing Tailwind setup.

**Solusi:**
**SKIP** import `scm-ui/styles` jika Anda sudah punya Tailwind v4 configured. scm-ui/styles hanya untuk project yang belum setup Tailwind. Cukup pastikan:
1. Tailwind content scan scm-ui path
2. shadcn components terinstall
3. Path alias `@/*` configured

### DataTable styling berbeda dari app saya

**Masalah:** DataTable terlihat berbeda dari rest of app, tidak match brand colors.

**Solusi:**
scm-ui sekarang menggunakan **shadcn components Anda**, jadi customize shadcn button, input, select, dan table components di project Anda. Perubahan akan otomatis ter-apply ke DataTable.

### Tailwind CSS version mismatch

**Masalah:** Error terkait Tailwind CSS version.

**Solusi:**
scm-ui memerlukan Tailwind CSS v4.0.0 atau lebih tinggi. Update Tailwind CSS Anda:

```bash
npm install tailwindcss@^4.0.0
```

---

## 🛠️ Development (untuk Contributors/Developers)

> **Section ini untuk Anda yang ingin develop atau contribute ke scm-ui package itu sendiri.**

### Setup Development Environment

Clone repository dan setup development environment:

```bash
# Clone repository
git clone git@github.com:solusi-cipta-media/scm-ui.git
cd scm-ui

# Install dependencies
npm install

# Install peer dependencies untuk development/Storybook
npm install --save-dev \
  @radix-ui/react-icons@^1.3.0 \
  @radix-ui/react-popover@^1.1.0 \
  @radix-ui/react-select@^2.2.0 \
  @radix-ui/react-slot@^1.2.0 \
  @tanstack/react-query@^5.0.0 \
  lucide-react@^0.468.0
```

### Available Scripts

```bash
# Run Storybook (development mode)
npm run storybook

# Build package
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check

# Lint code
npm run lint
```

### Documentation

📚 **Full documentation & examples tersedia di Storybook**

Storybook akan terbuka di [http://localhost:6006](http://localhost:6006) setelah menjalankan `npm run storybook`

---

## License

MIT
