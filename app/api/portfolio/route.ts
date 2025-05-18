import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { auth } from "@clerk/nextjs/server";
import { getTickersServer } from "@/app/utils/httpClient";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await db.portfolio.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const tickers = await getTickersServer();

  let totalPnl = 0;

  const portfolioWithPnL = portfolio.map((item) => {
    const ticker = tickers.find(
      (t) => t.symbol.toUpperCase() === item.symbol.toUpperCase()
    );
    const currentPrice = ticker ? Number(ticker.lastPrice) : 0;
    const pnl = (currentPrice - item.averagePrice) * item.quantity;

    totalPnl += pnl;

    return {
      ...item,
      currentPrice,
      pnl,
    };
  });

  return NextResponse.json({
    portfolio: portfolioWithPnL,
    totalPnl,
  });
}
