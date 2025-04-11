// Methods to get coin information from coin gecko
import { StandardCoinData } from "@/types/coins";

const BASE_URL =
  process.env.COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3";

export async function fetchCoinGeckoCoins(
  vsCurrency: string = "usd",
): Promise<StandardCoinData[]> {
  return [];
}

export async function fetchCoinDetailFromCoinGecko(
  id: string,
  vsCurrency: string = "usd",
): Promise<any> {
  return {};
}
