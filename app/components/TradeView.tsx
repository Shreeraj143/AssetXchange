import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";
import { SignalingManager } from "../utils/SignalingManager";
import { Loader2 } from "lucide-react";

export function TradeView({ market }: { market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      let klineData: KLine[] = [];
      try {
        klineData = await getKlines(
          market,
          "30m",
          Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 30) / 1000),
          Math.floor(new Date().getTime() / 1000)
        );
      } catch (e) {
        console.error("Error fetching initial Kline data", e);
      }

      if (chartRef.current) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        console.log("Initial Kline Data:", klineData);
        const chartManager = new ChartManager(
          chartRef.current,
          [
            ...klineData?.map((x) => ({
              close: parseFloat(x.close),
              high: parseFloat(x.high),
              low: parseFloat(x.low),
              open: parseFloat(x.open),
              timestamp: new Date(x.end),
            })),
          ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
          {
            background: "#ffffff",
            color: "black",
          }
        );
        //@ts-ignore
        chartManagerRef.current = chartManager;
        setChartLoaded(true);
      }
    };
    init();

    // Subscribe to live updates
    const signalingManager = SignalingManager.getInstance();
    signalingManager.registerCallback(
      "kline",
      (updatedPrice: any) => {
        console.log("Updating chart with:", updatedPrice);
        chartManagerRef.current?.update(updatedPrice);
      },
      `KLINE-${market}`
    );

    signalingManager.sendMessage({
      method: "SUBSCRIBE",
      params: [`kline@${market}_30m`], // Adjust interval as per exchange's format
    });

    return () => {
      signalingManager.deRegisterCallback("kline", `KLINE-${market}`);
    };
  }, [market, chartRef]);

  return (
    <>
      <div
        ref={chartRef}
        style={{ height: "520px", width: "100%", marginTop: 4 }}
      >
        {!chartLoaded && (
          <div className="flex justify-center items-center h-full">
            <Loader2 size={48} className="animate-spin" />
          </div>
        )}
      </div>
    </>
  );
}
