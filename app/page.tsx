"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import ProviderSelector from "@/components/ProviderSelector";
import { useCurrency } from "@/context/CurrencyContext";
import Link from "next/link";
import RecentCoins from "@/components/RecentCoins";
import ErrorCard from "@/components/ErrorCard";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) {
        errorMessage = body.error;
      }
    } catch {
      console.log("JSON Parsing Failed");
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

type SortConfig = { key: string; direction: "asc" | "desc" } | null;

export default function Home() {
  const { currency, setCurrency } = useCurrency();
  const [provider, setProvider] = useState("coinmarketcap");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localCoins, setLocalCoins] = useState<any[] | undefined>(undefined);

  const apiUrl = `/api/coins?vs_currency=${currency}&provider=${provider}`;
  const { data, error, mutate } = useSWR(apiUrl, fetcher);

  useEffect(() => {
    setLocalCoins(data?.coins);
  }, [data]);

  // Handle search input.
  function handleSearch(query: string) {
    setSearchQuery(query);
    setSelectedCoinId(null);
  }

  // Handle suggestion click.
  function handleSuggestionSelect(coin: any) {
    setSearchQuery(coin.name);
    setSelectedCoinId(coin.id);
  }

  const memoizedSuggestions = useMemo(() => localCoins, [localCoins]);

  let displayedCoins = localCoins;
  if (displayedCoins) {
    if (selectedCoinId) {
      displayedCoins = displayedCoins.filter(
        (c: any) => c.id === selectedCoinId,
      );
    } else if (searchQuery) {
      displayedCoins = displayedCoins.filter(
        (coin: any) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
  }

  // Default sort configuration: by marketCap in descending order.
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "marketCap",
    direction: "desc",
  });

  // Sorting handler: toggles sort direction or sets a new sort key.
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Memoize the sorted coins.
  const sortedCoins = useMemo(() => {
    if (!displayedCoins) return [];
    if (!sortConfig) return displayedCoins;

    const sorted = [...displayedCoins].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "currentPrice":
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case "marketCap":
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        case "priceChangePercentage24h":
          aValue = a.priceChangePercentage24h;
          bValue = b.priceChangePercentage24h;
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [displayedCoins, sortConfig]);

  // Refresh callback: clear the local coins then revalidate.
  const onRefresh = async () => {
    setIsRefreshing(true);
    setLocalCoins(undefined); // clear coins so skeleton shows
    await mutate(apiUrl, undefined);
    await mutate(apiUrl);
    setIsRefreshing(false);
  };

  // Error handling: display ErrorCard with error message.
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          suggestions={memoizedSuggestions || []}
          onRefresh={onRefresh}
        />
        <div className="p-4 flex-grow flex items-center justify-center">
          <ErrorCard
            message={
              error.message ||
              "We were unable to load the coin data at this time. Please try again later."
            }
            onRetry={onRefresh}
          />
        </div>
      </div>
    );
  }

  // While data is not loaded or during refresh, force skeleton loader.
  if (!data || isRefreshing || localCoins === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          suggestions={memoizedSuggestions || []}
          onRefresh={onRefresh}
        />
        <RecentCoins />
        <div
          className="p-4 relative"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-50">
              <tr>
                <th className="px-4 py-2 text-left w-16">#</th>
                <th className="px-4 py-2 text-left">Coin</th>
                <th className="px-4 py-2 text-right">Price ({currency})</th>
                <th className="px-4 py-2 text-right">Market Cap</th>
                <th className="px-4 py-2 text-right">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse border-b">
                  <td className="px-4 py-2 text-left w-16">
                    <div className="bg-gray-200 rounded h-4 w-6" />
                  </td>
                  <td className="px-4 py-2 text-left">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-200 rounded-full mr-2" />
                      <div className="bg-gray-200 rounded h-4 w-24" />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="bg-gray-200 rounded h-4 w-20" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="bg-gray-200 rounded h-4 w-24" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="bg-gray-200 rounded h-4 w-16" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // If data is loaded but filtering results in no coins.
  if (displayedCoins && displayedCoins.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          suggestions={memoizedSuggestions || []}
          onRefresh={onRefresh}
        />
        <RecentCoins />
        <div className="p-4">No coins found for query "{searchQuery}".</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
        suggestions={memoizedSuggestions || []}
        onRefresh={onRefresh}
      />
      <RecentCoins />
      <div className="p-4 flex items-center gap-4">
        <div>
          <label className="mr-2">Select Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            {["USD", "EUR", "CHF", "GBP", "INR"].map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
        <ProviderSelector onProviderChange={(prov) => setProvider(prov)} />
      </div>
      <div
        className="p-4 relative"
        style={{ maxHeight: "600px", overflowY: "auto" }}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-50">
            <tr>
              <th className="px-4 py-2 text-left w-16">#</th>
              <th
                className="px-4 py-2 text-left cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Coin&nbsp;
                {sortConfig?.key === "name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 text-right cursor-pointer select-none"
                onClick={() => handleSort("currentPrice")}
              >
                Price ({currency})&nbsp;
                {sortConfig?.key === "currentPrice" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 text-right cursor-pointer select-none"
                onClick={() => handleSort("marketCap")}
              >
                Market Cap&nbsp;
                {sortConfig?.key === "marketCap" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 text-right cursor-pointer select-none"
                onClick={() => handleSort("priceChangePercentage24h")}
              >
                24h Change&nbsp;
                {sortConfig?.key === "priceChangePercentage24h" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin: any, index: number) => (
              <tr key={coin.id} className="border-b">
                <td className="px-4 py-2 text-left w-16">{index + 1}</td>
                <td className="px-4 py-2 text-left">
                  {coin.image && (
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="inline w-5 h-5 mr-2 align-middle"
                    />
                  )}
                  <Link
                    href={`/coin/${coin.id}?provider=${provider}`}
                    className="text-blue-500 hover:underline align-middle"
                  >
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </Link>
                </td>
                <td className="px-4 py-2 text-right">
                  {coin.currentPrice.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  {coin.marketCap.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-2 text-right ${coin.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {coin.priceChangePercentage24h?.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
