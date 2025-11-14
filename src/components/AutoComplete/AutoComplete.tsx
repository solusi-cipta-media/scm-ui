"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover";
import { cn } from "../../utils/cn";

export interface AutoCompleteOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface AutoCompleteProps {
  value?: string;
  onValueChange: (value: string, option?: AutoCompleteOption) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  options: AutoCompleteOption[];
  renderOption?: (option: AutoCompleteOption) => React.ReactNode;
}

export function AutoComplete({
  value,
  onValueChange,
  placeholder = "Pilih opsi...",
  error,
  disabled = false,
  className,
  options,
  renderOption,
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find selected option
  const selectedOption = options.find((option) => option.value === value);

  // Update display value when selection changes
  useEffect(() => {
    if (selectedOption) {
      const newDisplayValue = defaultRenderSelected(selectedOption);
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
  }, [selectedOption, open]);

  // Filter options based on search
  const filteredOptions = options.filter((option) => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    return (
      option.label.toLowerCase().includes(searchLower) ||
      (option.subLabel && option.subLabel.toLowerCase().includes(searchLower))
    );
  });

  // Handle selection
  const handleSelect = (option: AutoCompleteOption) => {
    const newDisplayValue = defaultRenderSelected(option);

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
      const expectedValue = defaultRenderSelected(selectedOption);

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

  // Default option renderer
  const defaultRenderOption = (option: AutoCompleteOption) => (
    <div className="flex flex-col">
      <span className="font-medium">{option.label}</span>
      {option.subLabel && (
        <span className="text-xs text-muted-foreground">{option.subLabel}</span>
      )}
    </div>
  );

  // Default selected renderer
  const defaultRenderSelected = (option: AutoCompleteOption) => option.label;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
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
            />

            {/* Action buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {selectedOption && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                  className="p-1 hover:bg-gray-100 rounded z-10"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
                className="p-1 hover:bg-gray-100 rounded"
                tabIndex={-1}
              >
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </button>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 bg-white shadow-md rounded-md border"
          style={{
            width: containerRef.current?.offsetWidth || "auto",
          }}
          onOpenAutoFocus={(e: any) => e.preventDefault()}
          side="bottom"
          align="start"
        >
          {/* Results */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {search.trim() ? "Data tidak ditemukan" : "Belum ada data"}
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
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
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
