"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import RecentCoins from "@/components/RecentCoins";
import ErrorCard from "@/components/ErrorCard";
import { useRouter } from "next/navigation";
import CoinTable from "@/components/CoinTable";
import CoinCardList from "@/components/CoinCardList";
import MobileSortControl from "@/components/MobileSortControl";
import CoinFilterControls, {
  currencyOptions,
} from "@/components/CoinFilterControls";
import { useCurrency } from "@/context/CurrencyContext";
import { Option } from "@/components/CommonSelect";

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
  const [localCoins, setLocalCoins] = useState<any[] | undefined>();
  const [selectedCurrency, setSelectedCurrency] = useState<Option>(
    currencyOptions[0],
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "marketCap",
    direction: "desc",
  });
  const [mobileSortValue, setMobileSortValue] = useState<Option>({
    value: "marketCap",
    label: "Market Cap",
  });

  const router = useRouter();
  const apiUrl = `/api/coins?vs_currency=${currency}&provider=${provider}`;
  const { data, error, mutate } = useSWR(apiUrl, fetcher);

  useEffect(() => {
    setLocalCoins(data?.coins);
  }, [data]);

  // Memoize suggestions
  const memoizedSuggestions = useMemo(() => localCoins, [localCoins]);

  function handleSearch(query: string) {
    setSearchQuery(query);
    setSelectedCoinId(null);
  }

  function handleSuggestionSelect(coin: any) {
    setSearchQuery(coin.name);
    setSelectedCoinId(coin.id);
  }

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

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleMobileSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey = e.target.value;
    setSortConfig((prev) => ({
      key: newKey,
      direction: prev?.direction || "asc",
    }));
    setMobileSortValue({
      value: newKey,
      label: e.target.options[e.target.selectedIndex].text,
    });
  };

  const toggleMobileSortDirection = () => {
    setSortConfig((prev) =>
      prev
        ? {
            key: prev.key,
            direction: prev.direction === "asc" ? "desc" : "asc",
          }
        : { key: "marketCap", direction: "asc" },
    );
  };

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
      <div className="min-h-screen flex flex-col overflow-x-hidden">
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
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Navbar
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          suggestions={memoizedSuggestions || []}
          onRefresh={onRefresh}
        />
        <RecentCoins />
        <div className="p-4 overflow-x-auto animate-pulse text-sm">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-4"
              >
                <div className="w-1/5 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/5 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/5 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/5 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If data is loaded but filtering results in no coins.
  if (displayedCoins && displayedCoins.length === 0) {
    return (
      <div className="min-h-screen overflow-x-hidden">
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
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
        suggestions={memoizedSuggestions || []}
        onRefresh={onRefresh}
      />
      <RecentCoins />
      {/* Unified container with consistent padding */}
      <div className="p-4">
        <CoinFilterControls
          selectedCurrency={selectedCurrency}
          onCurrencyChange={(option) => {
            setSelectedCurrency(option);
            setCurrency(option.value);
          }}
          onProviderChange={(prov) => setProvider(prov)}
        />
        <MobileSortControl
          sortConfig={sortConfig}
          onSortKeyChange={handleSort}
          onSortDirectionToggle={toggleMobileSortDirection}
        />
        {/* Desktop Table */}
        <div className="hidden md:block">
          <CoinTable
            coins={sortedCoins}
            currency={currency}
            onRowClick={(coin) =>
              router.push(`/coin/${coin.id}?provider=${provider}`)
            }
            sortConfig={sortConfig}
            handleSort={handleSort}
            provider={provider}
          />
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden">
          <CoinCardList
            coins={sortedCoins}
            currency={currency}
            onCardClick={(coin) =>
              router.push(`/coin/${coin.id}?provider=${provider}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
