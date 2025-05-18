// app/api/news/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "cryptocurrency";

  try {
    const res = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 20,
        apiKey: NEWS_API_KEY,
      },
    });

    return NextResponse.json({ articles: res.data.articles });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
