// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useCallback } from "react";

interface CoinSuggestion {
  id: string;
  name: string;
  symbol: string;
}

interface NavbarProps {
  onSearch: (query: string) => void;
  onSuggestionSelect?: (coin: CoinSuggestion) => void;
  suggestions?: CoinSuggestion[];
  onRefresh?: () => void;
}

/**
 * Custom debounce hook that delays invoking callback until after delay ms.
 */
function useDebounce(callback: (value: string) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedFunction = useCallback(
    (value: string) => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay],
  );
  return debouncedFunction;
}

export default function Navbar({
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  onRefresh,
}: NavbarProps) {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce the update of query state by 300ms
  const debouncedSetQuery = useDebounce((value: string) => {
    setQuery(value);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSetQuery(val);
    setShowSuggestions(true);
  };

  // Compute filtered suggestions using useMemo
  const filteredSuggestions = useMemo(() => {
    if (query.length > 0) {
      return suggestions.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return [];
  }, [query, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: CoinSuggestion) => {
    setInputValue(suggestion.name);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      onSearch(suggestion.name);
    }
    setShowSuggestions(false);
  };

  return (
    <nav className="relative flex items-center justify-between p-4 bg-gray-50 shadow">
      <Link href="/" className="text-2xl font-bold text-orange-500">
        Crypto Search
      </Link>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Refresh Data
        </button>
      )}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Search coin..."
              value={inputValue}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-l-md"
              style={{ minWidth: "200px" }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              Search
            </button>
          </form>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-2 max-h-60 overflow-y-auto shadow-lg">
              {filteredSuggestions.slice(0, 10).map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name} ({suggestion.symbol.toUpperCase()})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
