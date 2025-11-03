# Datatable

Server-side data table component with pagination, sorting, and search functionality powered by React Query.

## Dependencies

This component requires additional UI components from your project. You need to set up the following shadcn/ui components in your consuming project:

### Required Components:

1. **Table Components** (`@/components/ui/table`)
   ```bash
   npx shadcn@latest add table
   ```

2. **Button** (`@/components/ui/button`)
   ```bash
   npx shadcn@latest add button
   ```

3. **Input** (`@/components/ui/input`)
   ```bash
   npx shadcn@latest add input
   ```

4. **Select** (`@/components/ui/select`)
   ```bash
   npx shadcn@latest add select
   ```

### Required Peer Dependencies:

- `@tanstack/react-query` (^5.0.0)
- `lucide-react` (for icons)

Install with:
```bash
npm install @tanstack/react-query lucide-react
```

## Usage

### 1. Setup React Query Provider

Wrap your app with `QueryClientProvider`:

```tsx
// app/layout.tsx or _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 2. Create Server Action

Create a server action that fetches data:

```ts
// app/actions/users.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function fetchUsers(params: {
  page: number
  pageSize: number
  search: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}) {
  const skip = (params.page - 1) * params.pageSize

  const where = params.search
    ? {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
        ],
      }
    : {}

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: params.pageSize,
      orderBy: { [params.sortBy]: params.sortOrder },
    }),
    prisma.user.count({ where }),
  ])

  return {
    success: true,
    data,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize),
    },
  }
}
```

### 3. Use the Component

```tsx
'use client'

import { Datatable, Column } from 'scm-ui'
import { fetchUsers } from '@/app/actions/users'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

export default function UsersPage() {
  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <Datatable
        fetchAction={fetchUsers}
        columns={columns}
        queryKey="users"
        searchPlaceholder="Search users..."
        defaultSortBy="createdAt"
        defaultSortOrder="desc"
      />
    </div>
  )
}
```

### 4. Using Ref to Invalidate

```tsx
'use client'

import { useRef } from 'react'
import { Datatable, DatatableRef } from 'scm-ui'

export default function UsersPage() {
  const tableRef = useRef<DatatableRef>(null)

  const handleUserCreated = () => {
    // Refresh the table after creating a user
    tableRef.current?.invalidate()
  }

  return (
    <>
      <CreateUserDialog onSuccess={handleUserCreated} />

      <Datatable
        ref={tableRef}
        fetchAction={fetchUsers}
        columns={columns}
        queryKey="users"
      />
    </>
  )
}
```

## Props

### `DatatableProps<T>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fetchAction` | `(params) => Promise<FetchResult<T>>` | Yes | - | Server action that fetches data |
| `columns` | `Column<T>[]` | Yes | - | Column definitions |
| `queryKey` | `string` | Yes | - | Unique key for React Query cache |
| `searchPlaceholder` | `string` | No | `"Cari..."` | Placeholder text for search input |
| `defaultSortBy` | `string` | No | `"createdAt"` | Default sort column |
| `defaultSortOrder` | `"asc" \| "desc"` | No | `"desc"` | Default sort order |

### `Column<T>`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | Yes | Data key to display |
| `label` | `string` | Yes | Column header label |
| `sortable` | `boolean` | No | Enable sorting for column |
| `render` | `(item: T, index: number) => ReactNode` | No | Custom render function |

### `FetchResult<T>`

Server action must return this shape:

```ts
interface FetchResult<T> {
  success: boolean
  data?: T[]
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  error?: string
}
```

## Features

- ✅ Server-side pagination
- ✅ Server-side sorting
- ✅ Debounced search (500ms)
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ React Query integration
- ✅ Optimistic updates with `placeholderData`
- ✅ Imperative refresh via ref

## Customization

The component uses Tailwind classes and can be customized by:
1. Modifying the component's className props
2. Overriding styles in your consuming project
3. Customizing the shadcn/ui components it depends on
