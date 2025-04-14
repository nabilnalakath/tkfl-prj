export interface StandardCoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  priceChangePercentage24h: number;
}
export interface CoinDetailData extends StandardCoinData {
  description: string;
  dateLaunched?: string;
  urls?: [];
}
