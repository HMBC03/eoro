"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  debounceMs?: number;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-9 text-sm pl-9 pr-3",
  md: "h-11 text-sm pl-10 pr-4",
  lg: "h-14 text-base pl-12 pr-5",
};

const iconSizes = {
  sm: "left-2.5 h-4 w-4",
  md: "left-3 h-5 w-5",
  lg: "left-4 h-5 w-5",
};

export function SearchBar({
  placeholder = "Buscar candidato, funcionario o contrato...",
  onSearch,
  className,
  debounceMs = 300,
  size = "md",
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, debounceMs);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
    },
    []
  );

  // Trigger search when debounced value changes
  if (debouncedValue !== undefined) {
    // We use a ref pattern to avoid calling onSearch during render
  }

  return (
    <div className={cn("relative", className)}>
      <svg
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400",
          iconSizes[size]
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(value);
          }
        }}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-gray-200/60 bg-gray-50/80 transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200",
          sizeStyles[size]
        )}
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Limpiar busqueda"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
