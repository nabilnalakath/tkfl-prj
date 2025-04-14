"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useCallback } from "react";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

interface CoinSuggestion {
  id: string;
  name: string;
  symbol: string;
}

interface NavbarProps {
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (coin: CoinSuggestion) => void;
  suggestions?: CoinSuggestion[];
  onRefresh?: () => void;
  minimal?: boolean;
}

/**
 * Custom debounce hook that delays invoking callback until after delay ms.
 */
function useDebounce(callback: (value: string) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (value: string) => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = setTimeout(() => callback(value), delay);
    },
    [callback, delay],
  );
}

export default function Navbar({
  onSearch = () => {},
  onSuggestionSelect,
  suggestions = [],
  onRefresh,
  minimal = false,
}: NavbarProps) {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchedLabel, setSearchedLabel] = useState<string | null>(null);

  const debouncedSetQuery = useDebounce(
    (value: string) => setQuery(value),
    300,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSetQuery(val);
    setShowSuggestions(true);
  };

  const filteredSuggestions = useMemo(() => {
    if (!query) return [];
    return suggestions.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    onSearch(trimmed);
    setSearchedLabel(trimmed);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: CoinSuggestion) => {
    setInputValue(suggestion.name);
    setQuery(suggestion.name);
    setSearchedLabel(suggestion.name);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      onSearch(suggestion.name);
    }
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setQuery("");
    setSearchedLabel(null);
    setShowSuggestions(false);
    onSearch("");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 min-h-[64px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Logo */}
        <div className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors">
          <Link href="/">Crypto Search</Link>
        </div>

        {/* Right Section: Search + Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {!minimal && (
            <>
              <div className="relative w-full sm:w-80">
                <form
                  onSubmit={handleSubmit}
                  className="flex rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-orange-500"
                >
                  <div className="relative flex-1">
                    {searchedLabel && !showSuggestions && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-2 z-10">
                        {searchedLabel}
                        <button
                          onClick={handleClearSearch}
                          type="button"
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Search coin..."
                      value={
                        searchedLabel && !showSuggestions ? "" : inputValue
                      }
                      onChange={handleInputChange}
                      disabled={!!(searchedLabel && !showSuggestions)}
                      className={`w-full px-3 py-2 focus:outline-none bg-white disabled:bg-gray-100 ${
                        searchedLabel && !showSuggestions
                          ? "pl-28 text-gray-600 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    Search
                  </button>
                </form>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow max-h-60 overflow-y-auto text-sm z-40 mt-1">
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

              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="cursor-pointer hidden sm:block px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4">
                      <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    Refresh
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
