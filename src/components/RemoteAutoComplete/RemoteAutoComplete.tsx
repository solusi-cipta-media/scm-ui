/**
 * Generic AutoComplete Component with Infinite Scroll
 *
 * A highly reusable and modular autocomplete component that can work with any API endpoint
 * and any data type. Features infinite scroll pagination for large datasets. Simply configure
 * the API endpoint, data transformation, pagination parameters, and optional custom rendering functions.
 *
 * @example Basic Usage:
 * ```tsx
 * <AutoComplete<MyDataType>
 *   value={selectedValue}
 *   onValueChange={(value, option) => setSelectedValue(value)}
 *   apiEndpoint="/api/my-data"
 *   queryKey={["/api/my-data"]}
 *   transformData={(items) => items.map(item => ({
 *     value: item.id,
 *     label: item.name,
 *     subLabel: item.description
 *   }))}
 * />
 * ```
 *
 * @example With Custom Rendering:
 * ```tsx
 * <AutoComplete<User>
 *   // ... other props
 *   renderOption={(option) => (
 *     <div className="flex items-center gap-2">
 *       <div>
 *         <div>{option.label}</div>
 *         <div className="text-sm text-gray-500">{option.subLabel}</div>
 *       </div>
 *     </div>
 *   )}
 *   getDisplayText={(option) => `${option.label} (${option.subLabel})`}
 * />
 * ```
 *
 * @example With Filters:
 * ```tsx
 * <AutoComplete<Student>
 *   // ... other props
 *   queryKey={["/api/students", classId, gradeLevel]}
 *   additionalParams={{ classId, gradeLevel, active: true }}
 * />
 * ```
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronDown, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "../../hooks/use-debounce";
import { PopoverTrigger, Popover, PopoverContent } from "../Popover/Popover";
import { cn } from "../../utils/cn";
import { FetchResult } from "../../types/pagination-result";

export interface RemoteAutoCompleteOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface RemoteAutoCompleteProps<T = any> {
  value?: string;
  onValueChange: (value: string, option?: RemoteAutoCompleteOption) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  fetchAction: (params: {
    page: number;
    pageSize: number;
    search: string;
  }) => Promise<FetchResult<T>>;

  // API Configuration
  queryKey: string | string[];
  pageSize?: number; // Number of items per page (default: 10)

  // Data transformation
  transformData: (data: T[]) => RemoteAutoCompleteOption[];

  // Custom rendering
  renderOption?: (option: RemoteAutoCompleteOption) => React.ReactNode;
  getDisplayText?: (option: RemoteAutoCompleteOption) => string; // For input display
}

export function RemoteAutoComplete<T = any>({
  value,
  onValueChange,
  placeholder = "Pilih opsi...",
  error,
  disabled = false,
  className,
  allowClear = true,
  queryKey,
  fetchAction,
  pageSize = 10,
  transformData,
  renderOption,
  getDisplayText,
}: RemoteAutoCompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [debouncedSearch] = useDebounce(search, 300);

  // Custom hook for display value management
  const getDisplayValue = useCallback(
    (option: RemoteAutoCompleteOption) => {
      return getDisplayText ? getDisplayText(option) : option.label;
    },
    [getDisplayText]
  );

  const {
    data,
    isLoading,
    error: fetchError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, debouncedSearch]
      : [queryKey, debouncedSearch],
    queryFn: async ({ pageParam: currentPage = 1 }) => {
      const response = await fetchAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
      });

      const items = response.data || [];
      const hasMore = response.pagination
        ? response.pagination.page < response.pagination.totalPages
        : false;

      return {
        items,
        nextPage: hasMore ? currentPage + 1 : undefined,
        hasNextPage: hasMore,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialPageParam: 1,
    enabled: true,
  });

  // Flatten all pages data
  const allItems = data?.pages.flatMap((page) => page.items) || [];

  // Transform raw data to options
  const options = transformData(allItems);

  // Find selected option
  const selectedOption = options.find((option) => option.value === value);

  // Update display value when selection changes or component mounts
  useEffect(() => {
    if (selectedOption) {
      const newDisplayValue = getDisplayValue(selectedOption);
      setDisplayValue(newDisplayValue);
      if (!open) {
        setSearch("");
      }
    } else {
      setDisplayValue("");
      if (!open) {
        setSearch("");
      }
    }
  }, [selectedOption, getDisplayValue, open, value]);

  // Filter options based on search (client-side filtering for already loaded data)
  const filteredOptions = options.filter((option) => {
    if (!search.trim()) return true; // Show all if no search
    const searchText = option.label;
    return searchText.toLowerCase().includes(search.toLowerCase());
  });

  // Intersection observer for infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (!hasNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // Handle selection
  const handleSelect = (option: RemoteAutoCompleteOption) => {
    const newDisplayValue = getDisplayValue(option);

    setDisplayValue(newDisplayValue);
    setSearch("");
    onValueChange(option.value, option);
    setOpen(false);
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange("", undefined);
    setSearch("");
    setDisplayValue("");
    setOpen(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    setSearch(newValue);

    // Clear selection when user starts typing something different
    if (selectedOption) {
      const expectedValue = getDisplayValue(selectedOption);

      if (newValue !== expectedValue) {
        onValueChange("", undefined);
      }
    }

    // Open dropdown when user types
    setOpen(true);
  };

  const handleInputClick = () => {
    setOpen(true);
  };

  // Reset search when closed and cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Memoized default option renderer
  const defaultRenderOption = useCallback(
    (option: RemoteAutoCompleteOption) => (
      <div className="flex flex-col">
        <span className="font-medium">{option.label}</span>
        {option.subLabel && (
          <span className="text-xs text-muted-foreground">
            {option.subLabel}
          </span>
        )}
      </div>
    ),
    []
  );

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              value={displayValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              placeholder={placeholder}
              className={cn(
                "w-full pr-16 cursor-pointer",
                error && "border-red-500 focus:border-red-500",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
              autoComplete="off"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-invalid={!!error}
              aria-describedby={error ? `${value}-error` : undefined}
            />

            {/* Action buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {selectedOption && allowClear && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-sm z-10"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                </button>
              )}
              <button
                disabled={disabled}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
                className="p-1 hover:bg-gray-100 rounded-sm"
                tabIndex={-1}
              >
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </button>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 bg-white shadow-md rounded-md"
          style={{
            width: containerRef.current?.offsetWidth || "auto",
          }}
          onOpenAutoFocus={(e: any) => e.preventDefault()}
          side="bottom"
          align="start"
        >
          {/* Results */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Memuat data...
              </div>
            )}

            {fetchError && (
              <div className="px-3 py-2 text-sm text-red-500">
                Gagal memuat data
              </div>
            )}

            {!isLoading && !fetchError && filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {search.trim() ? "Data tidak ditemukan" : "Belum ada data"}
              </div>
            )}

            {!isLoading && !fetchError && filteredOptions.length > 0 && (
              <div className="py-1">
                {filteredOptions.map((option, index) => {
                  const isLast = index === filteredOptions.length - 1;
                  return (
                    <div
                      key={option.value}
                      ref={isLast ? lastElementRef : null}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent text-sm",
                        value === option.value && "bg-accent"
                      )}
                      onClick={() => handleSelect(option)}
                    >
                      {renderOption
                        ? renderOption(option)
                        : defaultRenderOption(option)}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  );
                })}

                {/* Loading indicator for next page */}
                {isFetchingNextPage && (
                  <div className="px-3 py-2 text-sm text-muted-foreground flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    Memuat lebih banyak...
                  </div>
                )}

                {/* End indicator */}
                {!hasNextPage && filteredOptions.length > pageSize && (
                  <div className="px-3 py-1 text-xs text-muted-foreground text-center border-t">
                    Semua data telah dimuat
                  </div>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Error message */}
      {error && (
        <p id={`${value}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
