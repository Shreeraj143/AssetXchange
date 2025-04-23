import axios from "axios";

export async function fetchHistoricalPrices(symbol: string) {
  // const res = await getKlines(
  //   symbol,
  //   "30m",
  //   Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 30) / 1000),
  //   Math.floor(new Date().getTime() / 1000)
  // );

  const startTime = Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 30) / 1000);
  const endTime = Math.floor(Date.now() / 1000);

  const res = await axios.get(`/api/backpack/klines`, {
    params: {
      symbol,
      interval: "30m",
      startTime,
      endTime,
    },
  });

  return res.data.map((kline: any) => ({
    open: parseFloat(kline.open),
    close: parseFloat(kline.close),
  }));
}
