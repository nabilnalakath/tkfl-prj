"use client";

import { useState } from "react";

interface ProviderSelectorProps {
  onProviderChange: (provider: string) => void;
}

export default function ProviderSelector({
  onProviderChange,
}: ProviderSelectorProps) {
  const [provider, setProvider] = useState("coinmarketcap");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvider = e.target.value;
    setProvider(selectedProvider);
    onProviderChange(selectedProvider);
  };

  return (
    <select
      value={provider}
      onChange={handleChange}
      className="px-2 py-1 border rounded"
    >
      <option value="coinmarketcap">CoinMarketCap</option>

      {/* Removed the disabled flag once we implement the API methods for these providers.*/}
      <option value="coinpaprika" disabled>
        CoinPaprika
      </option>
      <option value="coingecko" disabled>
        CoinGecko
      </option>
    </select>
  );
}
