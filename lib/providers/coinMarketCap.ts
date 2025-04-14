import { CoinDetailData, StandardCoinData } from "@/types/coins";

const BASE_URL =
  process.env.COINMARKETCAP_BASE_URL || "https://pro-api.coinmarketcap.com/v1";
const API_KEY = process.env.COINMARKETCAP_API_KEY;

/**
 * Helper function to process errors and check for rate limiting.
 * It uses the text of the response (which is read only once) to extract details.
 */
async function handleError(response: Response): Promise<never> {
  // Read the response body once
  const bodyText = await response.text();

  // If status is 429 (rate limit), parse error message if possible.
  if (response.status === 429) {
    let rateLimitMsg = "Rate limit exceeded. Please try again later.";
    try {
      const bodyJson = JSON.parse(bodyText);
      rateLimitMsg = bodyJson?.status?.error_message || rateLimitMsg;
    } catch {
      // If parsing fails, fall back to default message.
    }
    console.error(
      `CoinMarketCap rate limit error. Status: ${response.status}. Message: ${rateLimitMsg}`,
    );
    throw new Error(rateLimitMsg);
  }

  // For other errors, log and throw a generic error.
  console.error(
    `Failed to fetch from CoinMarketCap. Status: ${response.status}. Response: ${bodyText}`,
  );
  throw new Error(`Failed to fetch info from CoinMarketCap.`);
}

export async function fetchCoinMarketCapCoins(
  vsCurrency: string = "usd",
): Promise<StandardCoinData[]> {
  try {
    const listingsEndpoint = `${BASE_URL}/cryptocurrency/listings/latest?start=1&limit=50&convert=${vsCurrency.toUpperCase()}`;
    const listingsRes = await fetch(listingsEndpoint, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY!,
        Accept: "application/json",
      },
    });
    if (!listingsRes.ok) {
      await handleError(listingsRes);
    }
    const listingsData = await listingsRes.json();
    const coinsData = listingsData.data;

    // Build a comma-separated list of coin IDs.
    const ids = coinsData.map((coin: any) => coin.id).join(",");
    const infoEndpoint = `${BASE_URL}/cryptocurrency/info?id=${ids}`;
    const infoRes = await fetch(infoEndpoint, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY!,
        Accept: "application/json",
      },
    });
    if (!infoRes.ok) {
      await handleError(infoRes);
    }
    const infoData = await infoRes.json();
    const infoMap = infoData.data;

    // Map raw data to StandardCoinData.
    const coins: StandardCoinData[] = coinsData.map((coin: any) => {
      const coinInfo = infoMap[coin.id];
      return {
        id: coin.id.toString(),
        name: coin.name,
        symbol: coin.symbol,
        image: coinInfo ? coinInfo.logo : "",
        currentPrice: coin.quote[vsCurrency.toUpperCase()].price,
        marketCap: coin.quote[vsCurrency.toUpperCase()].market_cap,
        priceChangePercentage24h:
          coin.quote[vsCurrency.toUpperCase()].percent_change_24h,
      };
    });
    return coins;
  } catch (err: any) {
    console.error("fetchCoinMarketCapCoins error:", err);
    throw new Error(
      err.message || "Unable to get coins list from CoinMarketCap",
    );
  }
}

export async function fetchCoinMarketCapCoinDetail(
  id: string,
  vsCurrency: string = "usd",
): Promise<any> {
  try {
    // Fetch static metadata.
    const infoEndpoint = `${BASE_URL}/cryptocurrency/info?id=${id}`;
    const infoRes = await fetch(infoEndpoint, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY!,
        Accept: "application/json",
      },
    });
    if (!infoRes.ok) {
      await handleError(infoRes);
    }
    const infoData = await infoRes.json();
    const coinInfo = infoData.data[id];

    // Fetch dynamic market data.
    const quotesEndpoint = `${BASE_URL}/cryptocurrency/quotes/latest?id=${id}&convert=${vsCurrency.toUpperCase()}`;
    const quotesRes = await fetch(quotesEndpoint, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY!,
        Accept: "application/json",
      },
    });
    if (!quotesRes.ok) {
      await handleError(quotesRes);
    }
    const quotesData = await quotesRes.json();
    const coinQuotes = quotesData.data[id].quote[vsCurrency.toUpperCase()];

    const coinDetail: CoinDetailData = {
      id,
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      image: coinInfo.logo,
      description: coinInfo.description || "",
      dateLaunched: coinInfo.date_launched,
      urls: coinInfo.urls || [],
      currentPrice: coinQuotes.price,
      marketCap: coinQuotes.market_cap,
      priceChangePercentage24h: coinQuotes.percent_change_24h,
    };
    return coinDetail;
  } catch (err: any) {
    console.error("fetchCoinMarketCapCoinDetail error:", err);
    throw new Error(
      err.message || "Unable to get coin details from CoinMarketCap",
    );
  }
}
