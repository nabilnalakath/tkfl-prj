// Methods to get coin information from coin paprika
import { StandardCoinData } from "@/types/coins";

const BASE_URL =
  process.env.COINPAPRIKA_BASE_URL || "https://api.coinpaprika.com/v1";

export async function fetchCoinPaprikaCoins(
  vsCurrency: string = "usd",
): Promise<StandardCoinData[]> {
  return [];
}

export async function fetchCoinPaprikaCoinDetail(
  id: string,
  vsCurrency: string = "usd",
): Promise<any> {
  return {};
}
