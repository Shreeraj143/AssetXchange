"use client";

import { useEffect, useState } from "react";
import { fetchHistoricalPrices } from "@/lib/priceFetcher";
import PredictionBanner from "../components/PredictionBanner";
import * as tf from "@tensorflow/tfjs";

type PricePredictionProps = {
  symbol: string;
};

export default function PredictPage({ symbol }: PricePredictionProps) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function predict() {
      try {
        console.log("Fetching price data...");
        const prices = await fetchHistoricalPrices(symbol);
        console.log("Fetched prices:", prices);

        const closePrices = prices.map((p: any) => p.close);

        // Check if we got enough data
        if (closePrices.length < 10) {
          throw new Error("Not enough data for prediction");
        }

        const tf = await import("@tensorflow/tfjs");

        // Normalize data
        const normalized = tf
          .tensor1d(closePrices)
          .div(tf.max(tf.tensor1d(closePrices)));
        const xs = normalized.slice(0, normalized.shape[0] - 1);
        const ys = normalized.slice(1);

        // Define simple dense model
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

        const last = normalized.slice(normalized.shape[0] - 1).reshape([1, 1]);
        const predictionTensor = model.predict(last) as tf.Tensor;

        const prediction =
          (await predictionTensor.data())[0] * Math.max(...closePrices);
        const currentPrice = closePrices[closePrices.length - 1];

        setResult({
          prediction,
          currentPrice,
          signal: prediction > currentPrice ? "BUY" : "SELL",
        });
      } catch (err) {
        console.error("Prediction error:", err);
      } finally {
        setLoading(false);
      }
    }

    predict();
  }, []);

  if (loading)
    return <div className="p-4 text-gray-600">Predicting price...</div>;
  if (!result)
    return <div className="p-4 text-red-500">Error fetching prediction</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <PredictionBanner
        currentPrice={result.currentPrice}
        prediction={result.prediction}
        signal={result.signal}
      />
    </div>
  );
}
