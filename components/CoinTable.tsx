"use client";

import Link from "next/link";
import Image from "next/image";
import { formatLargeNumber } from "@/lib/utils";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  currentPrice: number;
  marketCap: number;
  priceChangePercentage24h: number;
}

interface CoinTableProps {
  coins: Coin[];
  currency: string;
  onRowClick: (coin: Coin) => void;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  handleSort: (key: string) => void;
  provider: string;
}

export default function CoinTable({
  coins,
  currency,
  onRowClick,
  sortConfig,
  handleSort,
  provider,
}: CoinTableProps) {
  return (
    <div className="p-4">
      <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-xs text-gray-600 uppercase">
              <th className="px-4 py-3 text-left w-10">#</th>
              <th
                className="px-4 py-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Coin&nbsp;
                {sortConfig?.key === "name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() => handleSort("currentPrice")}
              >
                Price ({currency})&nbsp;
                {sortConfig?.key === "currentPrice" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() => handleSort("marketCap")}
              >
                Market Cap&nbsp;
                {sortConfig?.key === "marketCap" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() => handleSort("priceChangePercentage24h")}
              >
                24h Change&nbsp;
                {sortConfig?.key === "priceChangePercentage24h" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coins.map((coin, index) => (
              <tr
                key={coin.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick(coin)}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {coin.image && (
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 mr-2"
                    />
                  )}
                  <Link
                    href={`/coin/${coin.id}?provider=${provider}`}
                    className="text-blue-500 hover:underline"
                  >
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  {coin.currentPrice.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatLargeNumber(coin.marketCap)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    coin.priceChangePercentage24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
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
