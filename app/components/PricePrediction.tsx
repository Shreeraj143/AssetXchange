"use client";

import { useEffect, useState } from "react";
import { fetchHistoricalPrices } from "@/lib/priceFetcher";
import PredictionBanner from "./PredictionBanner";
import * as tf from "@tensorflow/tfjs";

type Props = {
  symbol: string;
};

export default function PricePrediction({ symbol }: Props) {
  const [result, setResult] = useState<{
    prediction: number;
    currentPrice: number;
    signal: "BUY" | "SELL";
    sentiment: "positive" | "neutral" | "negative";
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        const prices = await fetchHistoricalPrices(symbol);
        const closePrices = prices.map((p: any) => p.close);
        if (closePrices.length < 10) throw new Error("Not enough price data");

        const normalized = tf
          .tensor1d(closePrices)
          .div(tf.max(tf.tensor1d(closePrices)));
        const xs = normalized.slice(0, normalized.shape[0] - 1);
        const ys = normalized.slice(1);

        const model = tf.sequential();
        model.add(
          tf.layers.dense({ units: 10, inputShape: [1], activation: "relu" })
        );
        model.add(tf.layers.dense({ units: 1 }));
        model.compile({ loss: "meanSquaredError", optimizer: "adam" });

        await model.fit(xs.reshape([-1, 1]), ys.reshape([-1, 1]), {
          epochs: 50,
          verbose: 0,
        });

        const last = normalized
          .slice([normalized.shape[0] - 1], [1])
          .reshape([1, 1]);

        const predTensor = model.predict(last) as tf.Tensor;
        const prediction =
          (await predTensor.data())[0] * Math.max(...closePrices);
        const currentPrice = closePrices[closePrices.length - 1];
        const signal = prediction > currentPrice ? "BUY" : "SELL";

        const sentimentRes = await fetch(`/api/sentiment?symbol=${symbol}`);
        const data = await sentimentRes.json();
        const sentiment = data?.sentiment ?? "neutral";

        setResult({ prediction, currentPrice, signal, sentiment });
      } catch (err) {
        console.error("Prediction error:", err);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [symbol]);

  if (loading)
    return <div className="p-4 text-gray-600">Analyzing market...</div>;
  if (!result)
    return <div className="p-4 text-red-500">Error fetching prediction</div>;

  return (
    <div className="w-full">
      <PredictionBanner
        currentPrice={result.currentPrice}
        prediction={result.prediction}
        signal={result.signal}
        sentiment={result.sentiment}
      />
    </div>
  );
}
