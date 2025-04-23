// components/PredictionBanner.tsx
import React from "react";

interface Props {
  currentPrice: number;
  prediction: number;
  signal: "BUY" | "SELL";
}

export default function PredictionBanner({
  currentPrice,
  prediction,
  signal,
}: Props) {
  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">📈 AI Market Signal</h2>
      <p>Current Price: ${currentPrice.toFixed(2)}</p>
      <p>Predicted Price: ${prediction.toFixed(2)}</p>
      <p
        className={`font-semibold mt-2 ${
          signal === "BUY" ? "text-green-600" : "text-red-600"
        }`}
      >
        Signal: {signal}
      </p>
    </div>
  );
}
