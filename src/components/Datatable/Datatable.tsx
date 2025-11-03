"use client";

import { useState, useMemo, useCallback, forwardRef, useImperativeHandle, memo } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
}

// Memoized search controls to prevent re-render when parent re-renders
interface SearchControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: string) => void;
  searchPlaceholder: string;
  isLoading: boolean;
  isFetching: boolean;
}

const SearchControls = memo(({
  searchQuery,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  searchPlaceholder,
  isLoading,
  isFetching,
}: SearchControlsProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isFetching ? 'animate-pulse' : ''}`} />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Tampilkan</span>
        <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">data</span>
      </div>
    </div>
  );
});

SearchControls.displayName = "SearchControls";

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface FetchResult<T> {
  success: boolean;
  data?: T[];
  pagination?: PaginationData;
  error?: string;
}

interface DatatableProps<T> {
  fetchAction: (params: {
    page: number;
    pageSize: number;
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }) => Promise<FetchResult<T>>;
  columns: Column<T>[];
  queryKey: string;
  searchPlaceholder?: string;
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
}

export interface DatatableRef {
  invalidate: () => void;
}

function DatatableComponent<T extends Record<string, any>>(
  {
    fetchAction,
    columns,
    queryKey,
    searchPlaceholder = "Cari...",
    defaultSortBy = "createdAt",
    defaultSortOrder = "desc",
  }: DatatableProps<T>,
  ref: React.Ref<DatatableRef>
) {
  const queryClient = useQueryClient();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch data with React Query
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [queryKey, currentPage, pageSize, debouncedSearch, sortBy, sortOrder],
    queryFn: async () => {
      const result = await fetchAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      });
      return result;
    },
    placeholderData: keepPreviousData,
  });

  // Expose invalidate method to parent
  useImperativeHandle(ref, () => ({
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  }));

  // Extract data and pagination
  const tableData = useMemo(
    () => (data?.success ? (data.data as T[]) : []),
    [data]
  );
  const pagination = useMemo(
    () => (data?.success ? data.pagination : undefined),
    [data]
  );

  const totalRows = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 0;

  // Handlers with useCallback for stability
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSortChange = useCallback(
    (key: string) => {
      if (sortBy === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(key);
        setSortOrder("asc");
      }
    },
    [sortBy, sortOrder]
  );

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push("ellipsis-end");
      } else if (currentPage >= totalPages - 2) {
        pages.push("ellipsis-start");
        for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        pages.push("ellipsis-start");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis-end");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className="space-y-4">
      {/* Search and Page Size Controls */}
      <SearchControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        searchPlaceholder={searchPlaceholder}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">No</TableHead>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <button
                      onClick={() => handleSortChange(column.key)}
                      className="flex items-center gap-2 hover:text-gray-900 font-medium disabled:opacity-50"
                      disabled={isLoading || isFetching}
                    >
                      {column.label}
                      {sortBy === column.key ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                      )}
                    </button>
                  ) : (
                    <span className="font-medium">{column.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-gray-500"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-red-500"
                >
                  Terjadi kesalahan memuat data
                </TableCell>
              </TableRow>
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-gray-500"
                >
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((item, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index;
                const rowKey = item.id || `row-${globalIndex}`;
                return (
                  <TableRow key={rowKey}>
                    <TableCell className="text-center text-gray-600">
                      {globalIndex + 1}
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render
                          ? column.render(item, globalIndex)
                          : item[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Menampilkan {tableData.length > 0 ? startRow : 0} sampai {endRow} dari{" "}
          {totalRows} data
        </div>
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isLoading || isFetching}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {pageNumbers.map((pageNum, index) => {
            if (typeof pageNum === "string") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center h-9 w-9 text-gray-400"
                >
                  ...
                </div>
              );
            }

            const isActive = pageNum === currentPage;
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(pageNum)}
                disabled={isLoading || isFetching}
                className={`h-9 w-9 ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}

          {/* Next Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0 || isLoading || isFetching}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Datatable = forwardRef(DatatableComponent) as <T extends Record<string, any>>(
  props: DatatableProps<T> & { ref?: React.Ref<DatatableRef> }
) => ReturnType<typeof DatatableComponent>;
