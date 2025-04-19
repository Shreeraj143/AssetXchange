import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  // CoinLore API
  const coinLoreUrl = `https://www.coinlore.com/img/50x50/${symbol.toLowerCase()}.png`;

  // CryptoCompare API (requires a mapping for symbol -> image ID)
  const cryptoCompareUrl = `https://www.cryptocompare.com/media/37746238/${symbol.toLowerCase()}.png`;

  //   // Try CoinLore first
  try {
    const response = await fetch(coinLoreUrl, { method: "HEAD" });

    if (response.ok) {
      return NextResponse.json({ image: coinLoreUrl }, { status: 200 });
    }
  } catch (error) {
    console.error("CoinLore failed:", error);
  }

  // Try CryptoCompare as fallback
  //   try {
  //     const response = await fetch(cryptoCompareUrl, { method: "HEAD" });

  //     if (response.ok) {
  //       return NextResponse.json({ image: cryptoCompareUrl }, { status: 200 });
  //     }
  //   } catch (error) {
  //     console.error("CryptoCompare failed:", error);
  //   }

  // If both fail, return an error
  return NextResponse.json({ error: "Image not found" }, { status: 404 });
}
