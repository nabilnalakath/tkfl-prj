// Transformer helper to get coin data based on the current API provider user has choosen.
import { StandardCoinData } from "@/types/coins";
import {
  fetchCoinMarketCapCoins,
  fetchCoinMarketCapCoinDetail,
} from "./coinMarketCap";
import {
  fetchCoinPaprikaCoins,
  fetchCoinPaprikaCoinDetail,
} from "./coinPaprika";
import { fetchCoinDetailFromCoinGecko, fetchCoinGeckoCoins } from "./coinGecko";

export type Provider = "coinmarketcap" | "coinpaprika" | "coingecko";

export async function fetchCoins(
  provider: Provider,
  vsCurrency: string = "usd",
): Promise<StandardCoinData[]> {
  switch (provider) {
    case "coinpaprika":
      return await fetchCoinPaprikaCoins(vsCurrency);
    case "coinmarketcap":
      return await fetchCoinMarketCapCoins(vsCurrency);
    case "coingecko":
      return await fetchCoinGeckoCoins(vsCurrency);
    default:
      return await fetchCoinMarketCapCoins(vsCurrency);
  }
}

export async function fetchCoinDetail(
  provider: Provider,
  id: string,
  vsCurrency: string = "usd",
): Promise<any> {
  switch (provider) {
    case "coinpaprika":
      return await fetchCoinPaprikaCoinDetail(id, vsCurrency);
    case "coinmarketcap":
      return await fetchCoinMarketCapCoinDetail(id, vsCurrency);
    case "coingecko":
      return await fetchCoinDetailFromCoinGecko(id, vsCurrency);
    default:
      return await fetchCoinMarketCapCoinDetail(id, vsCurrency);
  }
}
