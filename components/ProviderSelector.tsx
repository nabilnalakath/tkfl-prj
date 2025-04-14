"use client";

import { useState } from "react";
import CommonSelect, { Option } from "@/components/CommonSelect";

/* Removed the disabled flag once we implement the API methods for these providers.*/
const providerOptions: Option[] = [
  { value: "coinmarketcap", label: "CoinMarketCap" },
  { value: "coinpaprika", label: "CoinPaprika", disabled: true },
  { value: "coingecko", label: "CoinGecko", disabled: true },
];

interface ProviderSelectorProps {
  onProviderChange: (provider: string) => void;
}

export default function ProviderSelector({
  onProviderChange,
}: ProviderSelectorProps) {
  const [selected, setSelected] = useState<Option>(providerOptions[0]);

  return (
    <CommonSelect
      options={providerOptions}
      value={selected}
      onChange={(option) => {
        setSelected(option);
        onProviderChange(option.value);
      }}
      className="w-64"
    />
  );
}
