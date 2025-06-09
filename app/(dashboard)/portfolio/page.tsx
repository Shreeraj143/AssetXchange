"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader2 } from "lucide-react";

type PortfolioItem = {
  id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  availableBalance: number;
  updatedAt: string;
  currentPrice: number;
  pnl: number;
};

export default function PortfolioPage() {
  const { isSignedIn } = useUser();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [totalPnl, setTotalPnl] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;

    axios
      .get("/api/portfolio")
      .then((res) => {
        setPortfolio(res.data.portfolio);
        setTotalPnl(res.data.totalPnl);
      })
      .catch((err) => console.error("Failed to load portfolio", err))
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isSignedIn)
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Please sign in to view your portfolio.
      </div>
    );
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Your Portfolio</h1>
      {portfolio.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <>
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Symbol</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-right">Avg. Price ($)</th>
                <th className="border p-2 text-right">Current Price ($)</th>
                <th className="border p-2 text-right">P&L ($)</th>
                <th className="border p-2 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">{item.symbol}</td>
                  <td className="border p-2 text-right">
                    {item.quantity.toFixed(4)}
                  </td>
                  <td className="border p-2 text-right">
                    ${item.averagePrice.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">
                    ${item.currentPrice.toFixed(2)}
                  </td>
                  <td
                    className={`border p-2 text-right font-semibold ${
                      item.pnl > 0
                        ? "text-green-600"
                        : item.pnl < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {item.pnl >= 0 ? "+" : ""}${item.pnl.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">
                    {new Date(item.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total PnL */}
          <div className="text-right mt-4 text-lg font-semibold">
            Total P&L:{" "}
            <span
              className={`${
                totalPnl > 0
                  ? "text-green-600"
                  : totalPnl < 0
                  ? "text-red-600"
                  : ""
              }`}
            >
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
