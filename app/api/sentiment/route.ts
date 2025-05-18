// app/api/sentiment/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY!;
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN!;

function extractCoinName(symbol: string): string {
  return symbol.split("_")[0]; // e.g., "BTC_USDC" -> "BTC"
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  const coin = extractCoinName(symbol).toUpperCase();
  console.log(coin);

  try {
    const newsRes = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: coin,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 4,
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = newsRes.data.articles || [];
    console.log(articles);

    if (articles.length === 0) {
      return NextResponse.json({ sentiment: "neutral" });
    }

    const scores: Record<"positive" | "neutral" | "negative", number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    const hfPromises = articles.map((article: any) => {
      const text = (article.title ?? "") + ". " + (article.description ?? "");
      return axios
        .post(
          "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
          { inputs: text },
          {
            headers: { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` },
          }
        )
        .then((res) => res.data)
        .catch(() => null);
    });

    const hfResults = await Promise.all(hfPromises);

    hfResults.forEach((result) => {
      const label = result?.[0]?.[0]?.label?.toLowerCase();
      if (label && scores[label as keyof typeof scores] !== undefined) {
        scores[label as keyof typeof scores]++;
      }
    });

    const dominant = Object.entries(scores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return NextResponse.json({ sentiment: dominant });
  } catch (error) {
    console.error("Sentiment fetch error:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}
