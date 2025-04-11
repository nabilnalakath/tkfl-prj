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
    <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg shadow my-4">
      <h2 className="text-lg font-semibold text-blue-800 mb-2">
        Recently Viewed Coins
      </h2>
      <div className="flex gap-2 flex-wrap">
        {recent.map((coin) => (
          <Link
            key={coin.id}
            href={`/coin/${coin.id}`}
            className="inline-block px-4 py-2 bg-white border border-blue-100 rounded-full text-blue-600 font-medium hover:bg-blue-100 transition"
          >
            {coin.name}{" "}
            <span className="text-sm">({coin.symbol.toUpperCase()})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
