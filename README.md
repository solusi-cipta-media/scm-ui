# SCM-UI

Component library untuk Next.js dengan TypeScript dan Tailwind CSS.

---

## 📦 Installation (untuk Consumer/User)

> **Section ini untuk Anda yang ingin menggunakan scm-ui di project Anda.**

## Installation

> **PENTING:** Peer dependencies harus diinstall **DULU** sebelum scm-ui package!

### 1. Install Peer Dependencies

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

**Catatan:** Jika project Anda sudah menggunakan shadcn/ui, kemungkinan besar packages ini sudah terinstall. Anda bisa skip packages yang sudah ada atau check dengan `npm list <package-name>`.

### 2. Install scm-ui Package

Setelah peer dependencies terinstall, install scm-ui:

```bash
# npm
npm install github:solusi-cipta-media/scm-ui

# yarn
yarn add github:solusi-cipta-media/scm-ui

# pnpm
pnpm add github:solusi-cipta-media/scm-ui
```

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

> **Note:** Tailwind v4 mendukung 2 cara konfigurasi. File `tailwind.config.js` bersifat **optional**. Pilih salah satu sesuai setup project Anda:

#### Opsi A: Jika Punya `tailwind.config.js` (JS-Based Config)

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

#### Opsi B: Jika Pakai CSS-Only Config (Tanpa tailwind.config.js)

Tambahkan `@source` directive di file CSS Anda (biasanya `app/globals.css` atau `src/styles/globals.css`):

```css
@import 'tailwindcss';

/* Add scm-ui source path */
@source "../node_modules/scm-ui/dist/**/*.{js,mjs}";

/* Your existing @source paths (if any) */
@source "../src/**/*.{js,ts,jsx,tsx,mdx}";
@source "../app/**/*.{js,ts,jsx,tsx,mdx}";

@theme {
  /* your theme config */
}
```

**Catatan:** Path relatif di `@source` dimulai dari lokasi file CSS. Sesuaikan `../` sesuai struktur project Anda.

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

### 2. Configure Tailwind Content Path

> **Tailwind v4 mendukung 2 cara konfigurasi.** Pilih salah satu pendekatan:

#### Pendekatan 1: JS-Based Config (Recommended untuk Compatibility)

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

**Keuntungan pendekatan ini:**
- Compatible dengan tools yang expect `tailwind.config.js` (seperti beberapa IDE plugins)
- Familiar untuk developers yang sudah pakai Tailwind v3
- Lebih mudah untuk share config dengan team

#### Pendekatan 2: CSS-Based Config (Pure Tailwind v4)

Jika Anda prefer **tidak** menggunakan `tailwind.config.js`, configure semuanya di CSS (`app/globals.css` atau `src/styles/globals.css`):

```css
@import 'tailwindcss';

/* Define content sources */
@source "../src/**/*.{js,ts,jsx,tsx,mdx}";
@source "../app/**/*.{js,ts,jsx,tsx,mdx}";
@source "../pages/**/*.{js,ts,jsx,tsx,mdx}";
@source "../components/**/*.{js,ts,jsx,tsx,mdx}";
/* WAJIB: Scan scm-ui components */
@source "../node_modules/scm-ui/dist/**/*.{js,mjs}";

@theme {
  /* Customize theme sesuai brand Anda */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;
}
```

**Keuntungan pendekatan ini:**
- Pure CSS, tidak perlu file JS config
- Sesuai dengan philosophy Tailwind v4 (CSS-first)
- Satu file untuk semua config

**Catatan:** Jika pakai CSS-based config, Anda **tidak perlu** `tailwind.config.js` sama sekali. Skip ke step berikutnya.

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

## 🎨 Theme Customization

### Semantic Color Tokens

scm-ui menggunakan **semantic color tokens** yang memungkinkan Anda customize theme dengan mudah. Components akan otomatis mengikuti theme yang Anda define.

#### Default Tokens (Fallback Values)

scm-ui menyediakan default values untuk semua tokens. Jika consumer tidak override, akan menggunakan values ini:

```css
--color-background: #ffffff;
--color-foreground: #09090b;
--color-muted: #f4f4f5;
--color-muted-foreground: #71717a;
--color-border: #e4e4e7;
--color-input: #e4e4e7;
--color-ring: #3b82f6;
--color-primary: #3b82f6;
--color-primary-foreground: #ffffff;
--color-secondary: #f4f4f5;
--color-secondary-foreground: #18181b;
--color-destructive: #ef4444;
--color-destructive-foreground: #ffffff;
--color-accent: #f4f4f5;
--color-accent-foreground: #18181b;
--color-popover: #ffffff;
--color-popover-foreground: #09090b;
```

#### How to Customize Theme

Anda bisa override semantic tokens di `globals.css` project Anda:

**Contoh 1: Simple Override (Hex Colors)**

```css
@import 'tailwindcss';
@import 'scm-ui/styles';

@theme inline {
  --color-primary: #2563eb;
  --color-primary-foreground: #ffffff;
  --color-muted: #f3f4f6;
  --color-muted-foreground: #6b7280;
}
```

**Contoh 2: Advanced Theme (OKLCH Colors)**

```css
@import 'tailwindcss';
@import 'scm-ui/styles';

@source "../node_modules/scm-ui/dist/**/*.{js,mjs}";

@theme inline {
  --color-primary: oklch(0.205 0 0);           /* dark/black */
  --color-primary-foreground: oklch(1 0 0);    /* white */
  --color-muted: oklch(0.97 0 0);              /* light gray */
  --color-muted-foreground: oklch(0.565 0 0);  /* medium gray */
  --color-border: oklch(0.922 0 0);            /* border gray */
  --color-accent: oklch(0.97 0 0);             /* accent background */
  --color-accent-foreground: oklch(0.205 0 0); /* accent text */
}
```

**Contoh 3: Dark Mode Support**

```css
:root {
  --primary: oklch(0.5 0.2 250);  /* light mode */
}

.dark {
  --primary: oklch(0.7 0.15 250); /* dark mode */
}
```

#### Token Usage in Components

Semua scm-ui components menggunakan semantic tokens:

- **DataTable**: `text-muted-foreground`, `bg-muted`, `border-border`, `text-foreground`
- **Button**: `bg-primary`, `text-primary-foreground`, `bg-accent`, `bg-destructive`
- **Input**: `border-input`, `placeholder:text-muted-foreground`, `focus:ring-ring`
- **Select**: `border-input`, `bg-popover`, `hover:bg-accent`

#### Benefits of Semantic Tokens

1. **Consistent Theming**: Override tokens sekali, apply ke semua components
2. **Flexible**: Support hex, rgb, hsl, oklch color formats
3. **Dark Mode Ready**: Easy to implement dark mode dengan CSS variables
4. **Brand Alignment**: Components otomatis match dengan brand colors Anda
5. **Future-Proof**: New components akan otomatis use theme Anda

#### Required Tokens

Minimal tokens yang harus defined jika Anda ingin full control:

- `foreground`, `background`
- `muted-foreground`, `muted`
- `border`, `input`, `ring`
- `primary`, `primary-foreground`
- `accent`, `accent-foreground`

Jika tidak defined, akan fallback ke default values yang sudah provided oleh scm-ui.

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
scm-ui menggunakan **semantic color tokens** yang bisa di-customize. Ada 2 cara:

1. **Override semantic tokens** di `globals.css` Anda:
   ```css
   @theme inline {
     --color-primary: #your-brand-color;
     --color-muted-foreground: #your-secondary-color;
     /* ... override tokens lainnya */
   }
   ```

2. **Customize shadcn components**: scm-ui menggunakan shadcn components dari project Anda, jadi perubahan pada button, input, select, dan table akan otomatis ter-apply ke DataTable.

Lihat section **Theme Customization** di atas untuk detail lengkap.

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
