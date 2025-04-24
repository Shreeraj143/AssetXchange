import axios from "axios";
import { db } from "../db/index.js";
// import { getDepth } from "../utils/httpClient.js";

const BASE_URL = "http://localhost:3000/api/backpack";

export async function checkPendingOrders() {
  console.log("🔁 File checkPendingOrders.js is running...");

  const pendingOrders = await db.order.findMany({
    where: { status: "PENDING" },
  });

  if (pendingOrders.length === 0) {
    console.log("✅ No pending orders found.");
    return;
  }

  for (const order of pendingOrders) {
    // const depthData = await getDepth(order.symbol);
    const response = await axios.get(
      `${BASE_URL}/depth?symbol=${order.symbol}`
    );
    // console.log("Depth is: ", response);
    const depthData = response.data;

    const bestBid = parseFloat(depthData.bids?.[0]?.[0] || "0");
    const bestAsk = parseFloat(depthData.asks?.[0]?.[0] || "0");

    let canExecute = false;

    if (order.type === "BUY" && order.price >= bestAsk) canExecute = true;
    else if (order.type === "SELL" && order.price <= bestBid) canExecute = true;

    if (canExecute) {
      const updatedOrder = await db.order.update({
        where: { id: order.id },
        data: {
          status: "SUCCESS",
          fulfilledAt: new Date(),
        },
      });

      const { userId, symbol, price, quantity } = updatedOrder;

      const existing = await db.portfolio.findUnique({
        where: { userId_symbol: { userId, symbol } },
      });

      if (existing) {
        const newQty = existing.quantity + quantity;
        const newAvgPrice =
          (existing.quantity * existing.averagePrice + quantity * price) /
          newQty;

        await db.portfolio.update({
          where: { userId_symbol: { userId, symbol } },
          data: {
            quantity: newQty,
            averagePrice: newAvgPrice,
          },
        });
      } else {
        await db.portfolio.create({
          data: { userId, symbol, quantity, averagePrice: price },
        });
      }

      console.log(`✅ Order ${order.id} fulfilled and portfolio updated.`);
    } else {
      console.log(`❌ Order ${order.id} cannot be fulfilled yet.`);
    }
  }

  await db.$disconnect();
}

setInterval(() => {
  console.log("Running the checkPendingOrders job...");
  checkPendingOrders().catch((err) =>
    console.error("Error executing job:", err)
  );
}, 60 * 1000); // 5 minutes in milliseconds

console.log("Scheduler is running...");
