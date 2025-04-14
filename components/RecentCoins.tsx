"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RecentCoin {
  id: string;
  name: string;
  symbol: string;
}

export default function RecentCoins() {
  const [recent, setRecent] = useState<RecentCoin[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentCoins");
    if (stored) {
      setRecent(JSON.parse(stored));
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm my-6 px-4 py-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">
          Recently Viewed Coins
        </h2>
        <div className="flex flex-wrap gap-2">
          {recent.map((coin) => (
            <Link
              key={coin.id}
              href={`/coin/${coin.id}`}
              className="px-3 py-1.5 rounded-full text-sm bg-gray-50 border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition whitespace-nowrap"
            >
              {coin.name}{" "}
              <span className="text-xs text-gray-500">
                ({coin.symbol.toUpperCase()})
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
