import { NextResponse } from "next/server";
import { fetchCoinDetail, Provider } from "@/lib/providers/transformer";

export async function GET(request: Request, context: any) {
  // Cast context to the desired shape
  const { params } = context as { params: { id: string } };
  const { id } = params;

  const { searchParams } = new URL(request.url);
  const vsCurrency = searchParams.get("vs_currency") || "usd";
  const providerParam = searchParams.get("provider");

  // Validate the provider string and default to coinmarketcap if invalid.
  let provider: Provider;
  if (
    providerParam === "coinpaprika" ||
    providerParam === "coingecko" ||
    providerParam === "coinmarketcap"
  ) {
    provider = providerParam;
  } else {
    provider = "coinmarketcap";
  }

  try {
    const coinDetails = await fetchCoinDetail(provider, id, vsCurrency);
    return NextResponse.json({ coin: coinDetails });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
