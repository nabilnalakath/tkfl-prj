"use client";

import CommonSelect, { Option } from "@/components/CommonSelect";
import ProviderSelector from "@/components/ProviderSelector";

export const currencyOptions: Option[] = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "CHF", label: "CHF" },
  { value: "GBP", label: "GBP" },
  { value: "INR", label: "INR" },
];

interface CoinFilterControlsProps {
  selectedCurrency: Option;
  onCurrencyChange: (option: Option) => void;
  onProviderChange: (provider: string) => void;
}

export default function CoinFilterControls({
  selectedCurrency,
  onCurrencyChange,
  onProviderChange,
}: CoinFilterControlsProps) {
  return (
    <div className="p-4 flex flex-wrap gap-4 items-center text-sm">
      <div className="flex items-center gap-2">
        <label className="text-gray-700 whitespace-nowrap">Currency:</label>
        <CommonSelect
          options={currencyOptions}
          value={selectedCurrency}
          onChange={(option) => onCurrencyChange(option)}
          className="w-40"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-gray-700 whitespace-nowrap">Provider:</label>
        <ProviderSelector onProviderChange={onProviderChange} />
      </div>
    </div>
  );
}
