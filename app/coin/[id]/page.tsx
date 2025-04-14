"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import { useCurrency } from "@/context/CurrencyContext";
import Link from "next/link";
import ErrorCard from "@/components/ErrorCard";
import { formatLargeNumber } from "@/lib/utils";
import {
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

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

export default function CoinDetailPage() {
  const params = useParams();
  const coinId = params.id;
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") || "coinmarketcap";

  const { currency } = useCurrency();
  const apiUrl = `/api/coins/${coinId}?vs_currency=${currency}&provider=${provider}`;
  const { data, error, mutate } = useSWR(apiUrl, fetcher);
  const coin = data?.coin;

  useEffect(() => {
    if (coinId && coin?.name) {
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
        <Navbar minimal />
        <ErrorCard
          message={error.message || "Unable to load coin details."}
          onRetry={() => mutate(apiUrl)}
        />
      </div>
    );

  if (!data || !coin)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar minimal />
        <div className="max-w-3xl mx-auto p-4">
          <div className="mt-8 bg-white rounded-lg shadow p-6 animate-pulse space-y-3">
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar minimal />
      <div className="max-w-3xl mx-auto p-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>

        <div className="mt-8 bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            {coin.image && (
              <Image
                src={coin.image}
                alt={coin.name}
                width={96}
                height={96}
                className="rounded-full mb-4"
              />
            )}
            <h1 className="text-3xl font-bold">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h1>
            {coin.category && (
              <span className="text-sm text-gray-500">{coin.category}</span>
            )}
          </div>

          {coin?.currentPrice && (
            <div className="space-y-2 text-gray-800 text-base">
              <p>
                <span className="font-semibold">
                  Current Price ({currency}):
                </span>{" "}
                {coin.currentPrice.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Market Cap:</span>{" "}
                {formatLargeNumber(coin.marketCap)}
              </p>
              <p>
                <span className="font-semibold">24h Change:</span>{" "}
                <span
                  className={
                    coin.priceChangePercentage24h >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {coin.priceChangePercentage24h?.toFixed(2)}%
                </span>
              </p>
              {coin.dateLaunched && (
                <p>
                  <span className="font-semibold">Launched:</span>{" "}
                  {new Date(coin.dateLaunched).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {coin.description && (
            <div>
              <h2 className="text-lg font-semibold mb-1">About</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {coin.description}
              </p>
            </div>
          )}

          {coin.urls && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Links</h2>
              <div className="flex flex-wrap gap-3 text-sm">
                {coin.urls.website?.[0] && (
                  <a
                    href={coin.urls.website[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
                    <span>Website</span>
                  </a>
                )}
                {coin.urls.reddit?.[0] && (
                  <a
                    href={coin.urls.reddit[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-orange-500 hover:underline"
                  >
                    <ChatBubbleBottomCenterTextIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Reddit</span>
                  </a>
                )}
                {coin.urls.message_board?.[0] && (
                  <a
                    href={coin.urls.message_board[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:underline"
                  >
                    <ChatBubbleBottomCenterTextIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Forum</span>
                  </a>
                )}
                {coin.urls.source_code?.[0] && (
                  <a
                    href={coin.urls.source_code[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-gray-700 hover:underline"
                  >
                    <CodeBracketIcon className="h-5 w-5" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                )}
                {coin.urls.explorer?.[0] && (
                  <a
                    href={coin.urls.explorer[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <MagnifyingGlassIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Explorer</span>
                  </a>
                )}
                {coin.urls.technical_doc?.[0] && (
                  <a
                    href={coin.urls.technical_doc[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
                    <span>Whitepaper</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
