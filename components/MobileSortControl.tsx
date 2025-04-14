"use client";

import CommonSelect, { Option } from "@/components/CommonSelect";

interface MobileSortControlProps {
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSortKeyChange: (newKey: string) => void;
  onSortDirectionToggle: () => void;
}

const mobileSortOptions: Option[] = [
  { value: "name", label: "Name" },
  { value: "currentPrice", label: "Price" },
  { value: "marketCap", label: "Market Cap" },
  { value: "priceChangePercentage24h", label: "24h Change" },
];

export default function MobileSortControl({
  sortConfig,
  onSortKeyChange,
  onSortDirectionToggle,
}: MobileSortControlProps) {
  // Create the selected option based on the current sort config.
  const selectedOption =
    mobileSortOptions.find((opt) => opt.value === sortConfig?.key) ||
    mobileSortOptions[0];

  return (
    <div className="block md:hidden px-4 pb-2">
      <div className="flex items-center gap-2">
        <span className="text-gray-600 text-sm">Sort By:</span>
        <CommonSelect
          options={mobileSortOptions}
          value={selectedOption}
          onChange={(option) => onSortKeyChange(option.value)}
          className="w-36"
        />
        <button
          onClick={onSortDirectionToggle}
          className="px-2 py-1 rounded-md border border-gray-300 shadow-sm text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {sortConfig?.direction === "asc" ? "▲" : "▼"}
        </button>
      </div>
    </div>
  );
}
