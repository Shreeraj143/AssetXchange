"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface NewsArticle {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  urlToImage: string;
}

const CryptoNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get<{ articles: NewsArticle[] }>(
          `/api/news?q=cryptocurrency`
        );
        const filteredNews = response.data.articles.filter(
          (article) => article.urlToImage
        );
        setNews(filteredNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📢 Crypto News</h2>
      <div className="space-y-6">
        {currentArticles.map((article, index) => (
          <div key={index} className="flex gap-4 border-b border-gray-700 pb-4">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-28 h-28 object-cover rounded-lg"
              />
            )}
            <div>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3 className="text-lg font-semibold hover:text-blue-400">
                  {article.title}
                </h3>
              </a>
              <p className="text-sm text-gray-400">
                {article.source.name} -{" "}
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={indexOfLastArticle >= news.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default CryptoNews;
