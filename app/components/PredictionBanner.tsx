interface Props {
  currentPrice: number;
  prediction: number;
  signal: "BUY" | "SELL";
  sentiment: "positive" | "neutral" | "negative";
  priceChangePercent?: number; // optional, % price change from current to prediction
  volume?: number; // optional, e.g., 24567.89
  confidence?: number; // optional, 0-1 confidence score for prediction
  lastUpdated?: string; // optional, ISO date/time string or formatted
}

export default function PredictionBanner({
  currentPrice,
  prediction,
  signal,
  sentiment,
  priceChangePercent,
  volume,
  confidence,
  lastUpdated,
}: Props) {
  const isBuy = signal === "BUY";
  const bgColor = isBuy ? "bg-green-50" : "bg-red-50";
  const textColor = isBuy ? "text-green-600" : "text-red-600";
  const sentimentColor =
    sentiment === "positive"
      ? "text-green-600"
      : sentiment === "negative"
      ? "text-red-600"
      : "text-gray-600";

  // Calculate absolute and percentage difference for price change
  const priceDiff = prediction - currentPrice;
  const priceDiffPercent =
    priceChangePercent ?? (priceDiff / currentPrice) * 100;

  // Sentiment icons
  const sentimentIcon =
    sentiment === "positive" ? "👍" : sentiment === "negative" ? "👎" : "😐";

  return (
    <div
      className={`rounded-md w-full px-8 py-4 ${bgColor} border border-gray-300 shadow-sm`}
      style={{ minHeight: 220 }} // force min height for more vertical space
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          📈 AI Market Insight
        </h2>
        <span
          className={`text-lg font-bold px-4 py-2 rounded-full border ${textColor} select-none`}
        >
          {signal}
        </span>
      </div>

      <div className="flex justify-between items-center text-base text-gray-700 mb-4">
        <div>
          <h1 className="font-semibold">Price Prediction:</h1>
          <p>
            Current Price:{" "}
            <span className="text-gray-900 font-semibold">
              ${currentPrice.toFixed(2)}
            </span>
          </p>
          <p>
            Predicted Price:{" "}
            <span className="text-gray-900 font-semibold">
              ${prediction.toFixed(2)}
            </span>
          </p>
          <p>
            Price Change:{" "}
            <span
              className={`font-semibold ${
                priceDiff >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {priceDiff >= 0 ? "+" : ""}
              {priceDiff.toFixed(2)} ({priceDiffPercent.toFixed(2)}%)
            </span>
          </p>
        </div>

        {volume !== undefined && (
          <div className="text-right">
            <p className="font-medium text-gray-600 uppercase text-xs tracking-wide">
              Volume (24h)
            </p>
            <p className="text-gray-900 font-semibold">
              {volume.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <h1 className="font-semibold">News Analysis:</h1>
      <div className="flex items-center space-x-2 mb-3">
        <span
          className={`text-xl select-none ${sentimentColor}`}
          title={`Sentiment: ${sentiment}`}
        >
          {sentimentIcon}
        </span>
        <p className={`text-sm font-semibold ${sentimentColor}`}>
          Sentiment:{" "}
          {sentiment
            ? sentiment.charAt(0).toUpperCase() + sentiment.slice(1)
            : "Unknown"}
        </p>
      </div>

      {confidence !== undefined && (
        <p className="text-sm text-gray-600 mb-3">
          Confidence Score:{" "}
          <span className="font-semibold">
            {(confidence * 100).toFixed(1)}%
          </span>
        </p>
      )}

      {lastUpdated && (
        <p className="text-xs text-gray-500 italic">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}

      <hr className="my-4 border-gray-300" />

      <p className="text-sm text-gray-700 leading-relaxed">
        Based on AI analysis of recent market trends and sentiment, this signal
        aims to help guide your trading decisions. Always trade responsibly.
      </p>
    </div>
  );
}
