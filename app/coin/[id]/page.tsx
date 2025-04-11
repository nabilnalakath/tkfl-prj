"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import { useCurrency } from "@/context/CurrencyContext";
import Link from "next/link";
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
    } catch (error) {
      console.log("JSON Parsing Failed", error);
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export default function CoinDetailPage() {
  const params = useParams();
  const coinId = params.id;

  // Extract provider from the query string; defaults to "coinmarketcap"
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") || "coinmarketcap";

  const { currency } = useCurrency();
  const apiUrl = `/api/coins/${coinId}?vs_currency=${currency}&provider=${provider}`;
  const { data, error, mutate } = useSWR(apiUrl, fetcher);
  const coin = data?.coin;

  useEffect(() => {
    if (coinId && coin && coin.name) {
      try {
        const recentKey = "recentCoins";
        let recent = JSON.parse(localStorage.getItem(recentKey) || "[]");
        recent = recent.filter((entry: { id: string }) => entry.id !== coinId);
        recent.unshift({ id: coinId, name: coin.name, symbol: coin.symbol });
        if (recent.length > 10) recent = recent.slice(0, 10);
        localStorage.setItem(recentKey, JSON.stringify(recent));
      } catch (e) {
        console.error("Error updating recent coins", e);
      }
    }
  }, [coinId, coin]);

  if (error)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={() => {}} />
        <ErrorCard
          message={
            error.message ||
            "We were unable to load the coin details at this time. Please try again later, or click on retry below."
          }
          onRetry={() => mutate(apiUrl)}
        />
      </div>
    );

  // skeleton card if data is not yet available.
  if (!data || !coin)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={() => {}} />
        <div className="max-w-3xl mx-auto p-4">
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={() => {}} />
      <div className="max-w-3xl mx-auto p-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h1>
          {coin.image && (
            <div className="mb-4">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-24 h-24 mx-auto"
              />
            </div>
          )}
          <div className="space-y-3">
            <p className="text-xl">
              <span className="font-semibold">Current Price ({currency}):</span>{" "}
              {coin.currentPrice.toLocaleString()}
            </p>
            <p className="text-xl">
              <span className="font-semibold">Market Cap:</span>{" "}
              {coin.marketCap.toLocaleString()}
            </p>
            <p className="text-xl">
              <span className="font-semibold">24h Change:</span>{" "}
              <span
                className={
                  coin.priceChangePercentage24h >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {coin.priceChangePercentage24h?.toFixed(2)}%
              </span>
            </p>
            {coin.description && (
              <p className="text-lg mt-4">
                <span className="font-semibold">Description:</span>{" "}
                {coin.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
