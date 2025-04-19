import { Ticker } from "./types";

export const BASE_URL = "wss://ws.backpack.exchange/";

export class SignalingManager {
  private ws: WebSocket | null = null;
  private static instance: SignalingManager;
  private bufferedMessages: any[] = [];
  private callbacks: Record<string, { callback: Function; id: string }[]> = {};
  private id: number = 1;
  private initialized: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000; // 3 seconds

  private constructor() {
    this.connect();
  }

  public static getInstance(): SignalingManager {
    if (!this.instance) {
      this.instance = new SignalingManager();
    }
    return this.instance;
  }

  private connect() {
    this.ws = new WebSocket(BASE_URL);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.initialized = true;
      this.reconnectAttempts = 0;
      this.bufferedMessages.forEach((message) => {
        this.ws?.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (!message?.data || !message.data.e) return;

      const type = message.data.e;
      if (this.callbacks[type]) {
        this.callbacks[type].forEach(({ callback }) => {
          if (type === "ticker") {
            const newTicker: Partial<Ticker> = {
              lastPrice: message.data.c,
              high: message.data.h,
              low: message.data.l,
              volume: message.data.v,
              quoteVolume: message.data.V,
              symbol: message.data.s,
            };
            console.log(`Ticker update for ${newTicker.symbol}:`, newTicker);
            callback(newTicker);
          }
          if (type === "depth") {
            const updatedBids = message.data.b;
            const updatedAsks = message.data.a;
            console.log("Order book depth update:", {
              bids: updatedBids,
              asks: updatedAsks,
            });
            console.log(
              `Ticker update for ${updatedBids.symbol}:`,
              updatedBids
            );
            callback({ bids: updatedBids, asks: updatedAsks });
          }
          if (type === "kline") {
            const klineData = message.data.k;
            console.log("Kline update received:", klineData);
            callback({
              close: parseFloat(klineData.c),
              high: parseFloat(klineData.h),
              low: parseFloat(klineData.l),
              open: parseFloat(klineData.o),
              time: klineData.t,
              newCandleInitiated: klineData.x, // Indicates a new candle formation
            });
          }
        });
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.warn("WebSocket disconnected");
      this.initialized = false;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          console.log("Attempting to reconnect...", this.reconnectAttempts + 1);
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectInterval);
      }
    };
  }

  sendMessage(message: any) {
    const messageToSend = {
      ...message,
      id: this.id++,
    };
    if (!this.initialized || !this.ws) {
      this.bufferedMessages.push(messageToSend);
      return;
    }
    this.ws.send(JSON.stringify(messageToSend));
  }

  registerCallback(type: string, callback: Function, id: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({ callback, id });
  }

  deRegisterCallback(type: string, id: string) {
    if (this.callbacks[type]) {
      this.callbacks[type] = this.callbacks[type].filter((cb) => cb.id !== id);
    }
  }
}
