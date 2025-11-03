import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Datatable, Column } from './Datatable'
import { useRef } from 'react'

// Mock data types
interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Generate mock users
const generateMockUsers = (count: number): User[] => {
  const roles = ['Admin', 'User', 'Manager', 'Guest']
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % 2],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }))
}

const allMockUsers = generateMockUsers(100)

// Mock fetch function
const mockFetchUsers = async (params: {
  page: number
  pageSize: number
  search: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter by search
  let filteredUsers = allMockUsers
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredUsers = allMockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
    )
  }

  // Sort
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aVal = a[params.sortBy as keyof User]
    const bVal = b[params.sortBy as keyof User]

    if (aVal < bVal) return params.sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return params.sortOrder === 'asc' ? 1 : -1
    return 0
  })

  // Paginate
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedUsers = sortedUsers.slice(start, end)

  return {
    success: true,
    data: paginatedUsers,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / params.pageSize),
    },
  }
}

// Mock fetch with error
const mockFetchUsersError = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  throw new Error('Failed to fetch users')
}

// Mock fetch with no data
const mockFetchUsersEmpty = async (params: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    success: true,
    data: [],
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total: 0,
      totalPages: 0,
    },
  }
}

// Column definitions
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
    render: (user) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {user.role}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (user) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {user.status}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (user) => new Date(user.createdAt).toLocaleDateString(),
  },
]

// Create a new QueryClient for each story to avoid cache issues
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const meta = {
  title: 'Components/Datatable',
  component: Datatable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Server-side data table with pagination, sorting, and search powered by React Query. Requires @tanstack/react-query to be installed.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = createQueryClient()
      return (
        <QueryClientProvider client={queryClient}>
          <div className="max-w-7xl">
            <Story />
          </div>
        </QueryClientProvider>
      )
    },
  ],
} satisfies Meta<typeof Datatable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    fetchAction: mockFetchUsers,
    columns,
    queryKey: 'users-default',
    searchPlaceholder: 'Search users...',
    defaultSortBy: 'name',
    defaultSortOrder: 'asc',
  },
}

export const SortedByDate: Story = {
  args: {
    fetchAction: mockFetchUsers,
    columns,
    queryKey: 'users-sorted',
    searchPlaceholder: 'Search users...',
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
  },
}

export const EmptyState: Story = {
  args: {
    fetchAction: mockFetchUsersEmpty,
    columns,
    queryKey: 'users-empty',
    searchPlaceholder: 'Search users...',
  },
}

export const CustomSearchPlaceholder: Story = {
  args: {
    fetchAction: mockFetchUsers,
    columns,
    queryKey: 'users-custom-search',
    searchPlaceholder: 'Cari pengguna berdasarkan nama, email, atau role...',
  },
}

export const WithRefInvalidate: Story = {
  render: () => {
    const queryClient = createQueryClient()
    const tableRef = useRef<any>(null)

    const handleRefresh = () => {
      tableRef.current?.invalidate()
    }

    return (
      <QueryClientProvider client={queryClient}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Users Table</h2>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Table
            </button>
          </div>
          <Datatable
            ref={tableRef}
            fetchAction={mockFetchUsers}
            columns={columns}
            queryKey="users-with-ref"
            searchPlaceholder="Search users..."
          />
        </div>
      </QueryClientProvider>
    )
  },
}

export const MinimalColumns: Story = {
  args: {
    fetchAction: mockFetchUsers,
    columns: [
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
    ],
    queryKey: 'users-minimal',
    searchPlaceholder: 'Search...',
  },
}

export const ManyColumns: Story = {
  args: {
    fetchAction: mockFetchUsers,
    columns: [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
      },
      ...columns,
    ],
    queryKey: 'users-many-columns',
    searchPlaceholder: 'Search users...',
  },
}

export const CustomRendering: Story = {
  args: {
    fetchAction: mockFetchUsers,
    columns: [
      {
        key: 'name',
        label: 'User',
        sortable: true,
        render: (user) => (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        label: 'Role',
        sortable: true,
        render: (user) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {user.role}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (user) => (
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-sm capitalize">{user.status}</span>
          </div>
        ),
      },
      {
        key: 'createdAt',
        label: 'Joined',
        sortable: true,
        render: (user) => (
          <div className="text-sm text-gray-600">
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        ),
      },
    ],
    queryKey: 'users-custom-render',
    searchPlaceholder: 'Search users...',
  },
}

// Note: Error state story removed as it causes issues in Storybook
// To test error state, you can modify the fetchAction to throw an error
