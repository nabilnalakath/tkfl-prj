import { NextResponse } from "next/server";
import { fetchCoins, Provider } from "@/lib/providers/transformer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vsCurrency = searchParams.get("vs_currency") || "usd";
    const provider =
      (searchParams.get("provider") as Provider) || "coinmarketcap";
    const coins = await fetchCoins(provider, vsCurrency);
    return NextResponse.json({ coins });
  } catch (error: any) {
    console.error("GET /api/coins error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
