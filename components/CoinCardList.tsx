"use client";

import { useRouter } from "next/navigation";
import { formatLargeNumber } from "@/lib/utils";
import Image from "next/image";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  currentPrice: number;
  marketCap: number;
  priceChangePercentage24h: number;
}

interface CoinCardListProps {
  coins: Coin[];
  currency: string;
  onCardClick: (coin: Coin) => void;
}

export default function CoinCardList({
  coins,
  currency,
  onCardClick,
}: CoinCardListProps) {
  return (
    <div className="p-4 space-y-4">
      {coins.map((coin, index) => (
        <div
          key={coin.id}
          className="border border-gray-200 rounded-lg p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition"
          onClick={() => onCardClick(coin)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-600">
              #{index + 1}
            </span>
            <span
              className={`text-sm font-medium ${
                coin.priceChangePercentage24h >= 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {coin.priceChangePercentage24h?.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            {coin.image && (
              <Image
                src={coin.image}
                alt={coin.name}
                width={24}
                height={24}
                className="w-6 h-6"
              />
            )}
            <div>
              <div className="text-sm font-medium text-blue-600">
                {coin.name} ({coin.symbol.toUpperCase()})
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <div>
              Price: {coin.currentPrice.toLocaleString()} {currency}
            </div>
            <div>Market Cap: {formatLargeNumber(coin.marketCap)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
